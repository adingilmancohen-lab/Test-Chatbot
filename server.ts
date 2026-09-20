import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { SYLLABUS_KNOWLEDGE_BASE_TEXT, SYSTEM_INSTRUCTIONS_TEXT } from "./src/data/syllabusKnowledgeBase";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "5mb" }));

// Helper to find and sanitize Gemini API Key (handles case sensitivity in process.env, quotes, whitespace)
function cleanKey(raw: string | undefined): string | undefined {
  if (!raw) return undefined;
  let key = raw.trim();
  if (
    (key.startsWith('"') && key.endsWith('"')) ||
    (key.startsWith("'") && key.endsWith("'"))
  ) {
    key = key.slice(1, -1).trim();
  }
  return key || undefined;
}

function findApiKeyInfo(): { key?: string; name?: string } {
  // 1. Direct checks for exact common names
  const directNames = [
    "GEMINI_API_KEY",
    "GOOGLE_API_KEY",
    "Gemini_API_KEY",
    "VITE_GEMINI_API_KEY",
  ];
  for (const name of directNames) {
    const val = cleanKey(process.env[name]);
    if (val) return { key: val, name };
  }

  // 2. Case-insensitive lookup across all keys in process.env (Vercel / Linux is case-sensitive)
  for (const [key, val] of Object.entries(process.env)) {
    if (typeof val === "string") {
      const upper = key.toUpperCase();
      if (
        upper === "GEMINI_API_KEY" ||
        upper === "GEMINI_KEY" ||
        upper === "GOOGLE_API_KEY" ||
        upper === "GOOGLE_GENAI_API_KEY" ||
        upper === "GEMINIAPIKEY" ||
        upper === "VITE_GEMINI_API_KEY"
      ) {
        const cleaned = cleanKey(val);
        if (cleaned) return { key: cleaned, name: key };
      }
    }
  }

  // 3. Fallback: any environment variable containing both 'GEMINI' and 'KEY'
  for (const [key, val] of Object.entries(process.env)) {
    if (typeof val === "string") {
      const upper = key.toUpperCase();
      if (upper.includes("GEMINI") && upper.includes("KEY")) {
        const cleaned = cleanKey(val);
        if (cleaned) return { key: cleaned, name: key };
      }
    }
  }

  return {};
}

// Initialize Gemini Client
function getGeminiClient(): GoogleGenAI {
  const { key, name } = findApiKeyInfo();
  if (!key) {
    throw new Error(
      "GEMINI_API_KEY is not available to the server. If you already added it in Vercel: Vercel does NOT update existing deployments automatically — you MUST click 'Redeploy' on your latest deployment in Vercel for new environment variables to take effect! Also ensure 'Production' is checked under Environment selection in Vercel."
    );
  }
  return new GoogleGenAI({
    apiKey: key,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

const apiRouter = express.Router();

// Health check with diagnostics (safe: does not reveal secret key value)
apiRouter.get("/health", (_req, res) => {
  const { key, name } = findApiKeyInfo();
  res.json({
    status: "ok",
    hasApiKey: !!key,
    detectedVariableName: name || null,
    isVercel: Boolean(process.env.VERCEL),
    timestamp: new Date().toISOString(),
    advice: !key
      ? "No API key found in runtime. If you added Gemini_API_KEY in Vercel, go to Deployments -> click '...' on latest deployment -> Redeploy."
      : "API key is loaded and ready.",
  });
});

// Draft new letter
apiRouter.post("/letter/generate", async (req, res) => {
  try {
    const {
      purpose,
      keyPoints,
      category = "formal",
      tone = "professional",
      length = "balanced",
      senderName = "",
      senderTitle = "",
      senderOrg = "",
      recipientName = "",
      recipientTitle = "",
      recipientOrg = "",
      date = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
    } = req.body;

    if (!purpose && !keyPoints) {
      return res.status(400).json({ error: "Please provide the purpose or key points of the letter." });
    }

    const ai = getGeminiClient();

    const prompt = `You are a master epistolary assistant and executive correspondence expert. Draft an eloquent, exquisitely composed letter tailored to the following requirements:

Category: ${category}
Intended Tone: ${tone}
Target Length: ${length}
Sender Information: Name: "${senderName}", Title: "${senderTitle}", Organization: "${senderOrg}"
Recipient Information: Name: "${recipientName}", Title: "${recipientTitle}", Organization: "${recipientOrg}"
Date: ${date}

Primary Purpose:
${purpose}

Key Points / Context / Facts to include:
${keyPoints || "Incorporate natural, well-reasoned content addressing the purpose."}

Rules:
- Strictly match the specified tone (${tone}).
- Craft well-proportioned, natural paragraphs with engaging topic sentences and smooth transitions.
- Avoid cliché phrases like "I am writing this letter to..." or "Hope this email finds you well" unless specifically suited to personal notes.
- Ensure the closing valediction matches the formality level (e.g., 'Sincerely,', 'Respectfully,', 'Warmest regards,').
- Return the response in strictly valid JSON according to the schema.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            subject: {
              type: Type.STRING,
              description: "Clear, professional subject line (or blank if personal note)",
            },
            salutation: {
              type: Type.STRING,
              description: "Appropriate salutation, e.g. 'Dear Mr. Sterling,' or 'Dear Eleanor,'",
            },
            bodyParagraphs: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Array of distinct paragraphs forming the body of the letter",
            },
            valediction: {
              type: Type.STRING,
              description: "Sign-off phrase, e.g. 'Sincerely,' or 'Warm regards,'",
            },
            postscript: {
              type: Type.STRING,
              description: "Optional P.S. note if relevant, or empty string",
            },
            toneAssessment: {
              type: Type.STRING,
              description: "A one-sentence summary of the achieved voice and tone",
            },
            writingTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "2 brief suggestions or things the sender might want to double-check before mailing",
            },
          },
          required: ["subject", "salutation", "bodyParagraphs", "valediction"],
        },
      },
    });

    const output = response.text ? JSON.parse(response.text) : null;
    if (!output) {
      throw new Error("No response generated from AI.");
    }

    res.json(output);
  } catch (error: any) {
    console.error("Error generating letter:", error);
    res.status(500).json({ error: error.message || "Failed to generate letter" });
  }
});

// Refine, polish, or rewrite an existing letter
apiRouter.post("/letter/refine", async (req, res) => {
  try {
    const {
      currentLetter,
      action,
      customInstruction = "",
    } = req.body;

    if (!currentLetter || !currentLetter.bodyParagraphs) {
      return res.status(400).json({ error: "Missing current letter content." });
    }

    const ai = getGeminiClient();

    let instruction = "";
    switch (action) {
      case "polish":
        instruction = "Improve flow, cadence, precision of vocabulary, and elegance while preserving original intent and facts.";
        break;
      case "more_formal":
        instruction = "Elevate the register to be strictly formal, dignified, and professional. Eliminate casual vernacular.";
        break;
      case "more_warm":
        instruction = "Infuse genuine warmth, empathy, and sincere personal connection without compromising clarity.";
        break;
      case "more_assertive":
        instruction = "Make the tone firm, direct, confident, and decisive. Clearly state boundaries, expectations, or required actions.";
        break;
      case "more_concise":
        instruction = "Condense and streamline the letter. Remove redundancies, tighten sentences, and keep only essential points.";
        break;
      case "expand":
        instruction = "Elaborate with richer detail, supportive rationale, courteous transitional context, and thorough explanations.";
        break;
      case "fix_grammar":
        instruction = "Correct all grammatical, punctuation, typographical, and syntactic flaws while preserving exact meaning.";
        break;
      case "custom":
        instruction = customInstruction || "Refine the letter as requested.";
        break;
      default:
        instruction = "Refine the letter for maximum effectiveness and readability.";
    }

    const prompt = `You are an expert letter editor. Refine the following letter according to this specific directive:
Directive: ${instruction}

Current Letter:
Subject: ${currentLetter.subject || "N/A"}
Salutation: ${currentLetter.salutation || "N/A"}
Body:
${(currentLetter.bodyParagraphs || []).join("\n\n")}
Valediction: ${currentLetter.valediction || "Sincerely,"}
Postscript: ${currentLetter.postscript || ""}

Provide the refined version in JSON matching the schema. Also provide a summary of the edits made.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            subject: { type: Type.STRING },
            salutation: { type: Type.STRING },
            bodyParagraphs: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            valediction: { type: Type.STRING },
            postscript: { type: Type.STRING },
            editSummary: {
              type: Type.STRING,
              description: "A short sentence highlighting the key improvements made.",
            },
          },
          required: ["subject", "salutation", "bodyParagraphs", "valediction", "editSummary"],
        },
      },
    });

    const output = response.text ? JSON.parse(response.text) : null;
    res.json(output);
  } catch (error: any) {
    console.error("Error refining letter:", error);
    res.status(500).json({ error: error.message || "Failed to refine letter" });
  }
});

// Critique & etiquette analysis
apiRouter.post("/letter/critique", async (req, res) => {
  try {
    const { letter, intendedAudience = "General professional" } = req.body;
    if (!letter || !letter.bodyParagraphs) {
      return res.status(400).json({ error: "Missing letter content." });
    }

    const ai = getGeminiClient();

    const prompt = `You are a certified communications consultant and etiquette expert. Review this letter intended for: "${intendedAudience}".

Subject: ${letter.subject || "(None)"}
Salutation: ${letter.salutation || ""}
Body:
${letter.bodyParagraphs.join("\n\n")}
Valediction: ${letter.valediction || ""}

Analyze the correspondence:
1. Overall tone perception (how the recipient will likely perceive it)
2. Strengths (2-3 items)
3. Opportunities for improvement or potential pitfalls (2-3 items)
4. Etiquette & Politeness score out of 100
5. Clarity score out of 100`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            toneImpression: { type: Type.STRING },
            politenessScore: { type: Type.INTEGER },
            clarityScore: { type: Type.INTEGER },
            strengths: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            improvements: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            verdict: { type: Type.STRING, description: "One sentence final verdict" },
          },
          required: ["toneImpression", "politenessScore", "clarityScore", "strengths", "improvements", "verdict"],
        },
      },
    });

    const output = response.text ? JSON.parse(response.text) : null;
    res.json(output);
  } catch (error: any) {
    console.error("Error critiquing letter:", error);
    res.status(500).json({ error: error.message || "Failed to critique letter" });
  }
});

// Reliable Peer UC Berkeley MDes Assistant Endpoint - Generates or revises actual email using syllabus knowledge base
const handlePeerPrompt = async (req: express.Request, res: express.Response) => {
  try {
    const {
      prompt: directPrompt = "",
      userPrompt = "",
      initialAsk = "",
      senderName = "",
      senderEmail = "",
      revisionFeedback = "",
      currentEmail = null,
      additionalInfo = "",
      conversationHistory = [],
    } = req.body;

    const finalUserPrompt = (
      directPrompt ||
      userPrompt ||
      initialAsk ||
      "Write an email to notify the instructor about missing studio today due to sickness"
    ).trim();

    const activeSenderName = (senderName || "").trim() || "Student";
    const activeSenderEmail = (senderEmail || "").trim() || `${activeSenderName.toLowerCase().replace(/[^a-z0-9]/g, "") || "student"}@berkeley.edu`;
    const isRevision = Boolean(revisionFeedback && revisionFeedback.trim() && currentEmail);

    const ai = getGeminiClient();

    const systemPrompt = `${SYSTEM_INSTRUCTIONS_TEXT}

=== ATTACHED SYLLABUS KNOWLEDGE BASE ===
${SYLLABUS_KNOWLEDGE_BASE_TEXT}

=== SENDER IDENTITY ===
Name: ${activeSenderName}
Email: ${activeSenderEmail}

${isRevision ? `=== TASK: REVISE EXISTING EMAIL ===
You are revising the user's previously generated email based on their specific feedback.
Existing Email:
${JSON.stringify(currentEmail, null, 2)}

User Feedback for Revision:
"${revisionFeedback.trim()}"

Original Prompt:
"${finalUserPrompt}"` : `=== TASK: DRAFT NEW EMAIL ===
User Request / Prompt:
"${finalUserPrompt}"`}

${additionalInfo ? `Additional Context/Info: "${additionalInfo}"` : ""}
${conversationHistory && conversationHistory.length > 0 ? `Previous History: ${JSON.stringify(conversationHistory.slice(-4))}` : ""}

DIRECTIVES:
1. Identify the intended recipient (e.g. Hugh Dubberly for DES INV 200, Chris Myers / Sudhu Tewari / TJ McLeish / Joris Komen for DESINV 202, or general MDes faculty/staff). Use their FIRST NAME only in the salutation (e.g. "Hi Hugh,", "Hi Chris,", "Hi Sudhu,", "Hi Joris,").
2. Compose/revise the complete, ready-to-send email letter on behalf of ${activeSenderName} (${activeSenderEmail}). The senderName MUST be "${activeSenderName}" and senderEmail MUST be "${activeSenderEmail}". Do NOT hardcode "Yuwen" unless the user specified "Yuwen".
3. If this is a revision, directly apply all instructions from the User Feedback (e.g. adjust tone, add a specific detail, make it shorter/longer, emphasize project progress) while maintaining syllabus compliance and the studio norms.
4. Reference or follow the course policy (such as filling out the bCourses Absence & Tardiness Form for DESINV 202, notifying in advance for DES INV 200, the 2 unexcused absences allowance, or coordinating teammate handoff for pinups/critiques at Jacobs Hall).
5. Do NOT output conversational advice or meta-commentary—directly output the complete revised or drafted email.
6. Provide the exact relevant policy citation/snippet from the attached syllabus under 'policyReference'.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: systemPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            email: {
              type: Type.OBJECT,
              properties: {
                recipientName: { type: Type.STRING, description: "First name of recipient, e.g. Hugh or Chris" },
                recipientEmail: { type: Type.STRING, description: "Email address of recipient from syllabus if known" },
                senderName: { type: Type.STRING, description: "Sender name as provided by user" },
                senderEmail: { type: Type.STRING, description: "Sender email as provided by user" },
                subject: { type: Type.STRING },
                salutation: { type: Type.STRING },
                bodyParagraphs: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                valediction: { type: Type.STRING },
                postscript: { type: Type.STRING },
              },
              required: ["recipientName", "recipientEmail", "senderName", "senderEmail", "subject", "salutation", "bodyParagraphs", "valediction"],
            },
            policyReference: {
              type: Type.STRING,
              description: "Applicable UC Berkeley syllabus policy snippet or citation from knowledge base",
            },
            nextLoopStep: {
              type: Type.INTEGER,
              description: "Step number (1 to 4)",
            },
            currentStepName: {
              type: Type.STRING,
              description: "Short title of the step executed",
            },
            ruleChecks: {
              type: Type.OBJECT,
              properties: {
                professionalTone: { type: Type.BOOLEAN },
                directAccountability: { type: Type.BOOLEAN },
                noOverSharing: { type: Type.BOOLEAN },
                policyCompliant: { type: Type.BOOLEAN },
              },
              required: ["professionalTone", "directAccountability", "noOverSharing", "policyCompliant"],
            },
          },
          required: ["email", "policyReference", "nextLoopStep", "currentStepName"],
        },
      },
    });

    const output = response.text ? JSON.parse(response.text) : null;
    res.json(output);
  } catch (error: any) {
    console.error("Error in peer consult:", error);
    res.status(500).json({ error: error.message || "Failed to generate peer draft" });
  }
};

apiRouter.post("/peer/consult", handlePeerPrompt);
apiRouter.post("/peer/generate", handlePeerPrompt);

// Reply generator based on received letter
apiRouter.post("/letter/reply", async (req, res) => {
  try {
    const { receivedLetterText, responseGoal, tone = "diplomatic", yourName = "" } = req.body;
    if (!receivedLetterText) {
      return res.status(400).json({ error: "Please provide the letter you received." });
    }

    const ai = getGeminiClient();

    const prompt = `You are an expert correspondent. The user received the following letter:

--- RECEIVED LETTER START ---
${receivedLetterText}
--- RECEIVED LETTER END ---

Goal for the response:
${responseGoal}

Desired Tone: ${tone}
Sender Name: ${yourName || "The Sender"}

Craft a formal, thoughtful, and effective reply that directly addresses the incoming letter points while achieving the user's response goal.
Format as JSON matching the schema.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            subject: { type: Type.STRING },
            salutation: { type: Type.STRING },
            bodyParagraphs: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            valediction: { type: Type.STRING },
            postscript: { type: Type.STRING },
            strategyNote: {
              type: Type.STRING,
              description: "Why this response is strategically effective",
            },
          },
          required: ["subject", "salutation", "bodyParagraphs", "valediction"],
        },
      },
    });

    const output = response.text ? JSON.parse(response.text) : null;
    res.json(output);
  } catch (error: any) {
    console.error("Error generating reply:", error);
    res.status(500).json({ error: error.message || "Failed to generate reply" });
  }
});

// Mount router under both /api and root (to handle direct requests and Vercel rewrites)
app.use("/api", apiRouter);
app.use(apiRouter);

export { app };
export default app;

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

// Only start standalone HTTP server when not in Vercel serverless environment
if (!process.env.VERCEL) {
  startServer();
}
