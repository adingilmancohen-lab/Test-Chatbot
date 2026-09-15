import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "5mb" }));

// Initialize Gemini Client
function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY environment variable is missing. On Vercel: go to Project Settings -> Environment Variables, add GEMINI_API_KEY with your Google AI Studio API key, and redeploy."
    );
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

const apiRouter = express.Router();

// Health check
apiRouter.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
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

// Reliable Peer UC Berkeley MDes Assistant Endpoint - Generates actual email, not advice
apiRouter.post("/peer/consult", async (req, res) => {
  try {
    const {
      initialAsk = "Write a casual email to Hugh notifying him of my absence from class due to serious sickness",
      specificOutput = "casual email draft to Hugh",
      additionalInfo = "",
      currentLoopStep = 1, // 1: suggestion, 2: ask symptoms, 3: clarify, 4: alternative
      conversationHistory = [],
    } = req.body;

    const ai = getGeminiClient();

    const loopStepDescriptions: Record<number, string> = {
      1: "Step 1: Casual initial absence notice to Hugh with a quick deliverable handoff plan.",
      2: "Step 2: Casual absence email mentioning medical checkup at Tang Center (UHS) without oversharing.",
      3: "Step 3: Studio deliverables handoff email detailing Jacobs Hall critique plan with partner.",
      4: "Step 4: Alternative arrangements email (e.g. async critique review, partner pin-up, or office hour catchup).",
    };

    const currentStepDescription = loopStepDescriptions[currentLoopStep] || loopStepDescriptions[1];

    const prompt = `You are an AI assistant specialized for UC Berkeley Master of Design (MDes) graduate students.

CRITICAL DIRECTIVES:
1. GENERATE AN EMAIL, NOT ADVICE:
Do NOT output conversational advice, meta-instructions, coaching tips, or commentary on what the user should write.
Directly compose the actual, ready-to-send email addressed to Hugh (or the indicated recipient) that Yuwen can send via bMail / email.

2. CASUAL TONE & FIRST-NAME BASIS (VERY IMPORTANT):
MDes professors and instructors (including Hugh Dubberly) are VERY CASUAL. They work closely with students in Jacobs Hall studios and go by their first names.
- Address EVERYONE by their FIRST NAME only. Always use "Hi Hugh," or "Hey Hugh,"—NEVER "Dear Professor Dubberly", "Dear Professor", "Mr. Dubberly", etc.
- Use a casual, friendly, natural, and collegiate studio tone. Speak student-to-professor in a peer-like, respectful yet relaxed manner.
- Do NOT use stiff, formal, or archaic academic language (e.g. do NOT say "I am writing to formally notify you that I will be unable to attend..."). Instead say something natural like "Wanted to give you a quick heads up that I won’t be able to make it to studio tomorrow..."
- Keep it concise, direct, and considerate of everyone's time.
- Salutation: "Hi Hugh," or "Hey Hugh,"
- Valediction: "Best," or "Thanks," (just the closing word with comma, without the sender name)
- Sender Name: "Yuwen"

[CONTEXT & CHARACTERS]
- Student (Sender): Yuwen, UC Berkeley MDes graduate student. First name: Yuwen. Email: yuwen@berkeley.edu.
- Recipient: Hugh Dubberly, MDes professor at Jacobs Hall (DES INV 200 Systems). First name: Hugh. Email: dubberly@berkeley.edu.
- Recipient Profile: Hugh is a legendary design planner and systems thinker (Dubberly Design Office). In studio, he's very approachable, casual, and goes by Hugh. He appreciates quick proactive communication, clear ownership of work, and knowing team deliverables are sorted.
- Campus Context: UC Berkeley, Jacobs Hall studio critique, Tang Center (University Health Services / UHS).

[CURRENT INTERACTION LOOP FOCUS]
${currentStepDescription}

[USER INPUTS]
Initial ask: "${initialAsk}"
Specific output requested: "${specificOutput}"
Additional info / symptoms: "${additionalInfo}"
Previous context: ${JSON.stringify(conversationHistory.slice(-4))}

[EMAIL WRITING STANDARDS]
- Tone: Casual, friendly, direct, and responsible.
- First-name addressing: Always "Hi Hugh,".
- Clearly states missing studio due to feeling sick and needing to get checked out at the Tang Center.
- No weird or gross oversharing—keeps medical details casual and high-level (e.g., "came down with a pretty bad bug/fever").
- Reassures Hugh about the Systems deliverable: mentions files are in Figma/Drive and partner (Elena) will pin up and present during critique.
- Proposes catching up on critique feedback once recovered.
- Closing: "Best," or "Thanks," then "Yuwen".

Produce:
1. email: The complete, ready-to-send email object (subject, recipientName, recipientEmail, senderName, senderEmail, salutation, bodyParagraphs, valediction, postscript). recipientName should be "Hugh".
2. policyReference: Relevant UC Berkeley policy (e.g. Tang Center UHS medical excuse guidelines, Jacobs Hall studio culture).
3. nextLoopStep: Next integer (1 to 4).
4. currentStepName: Short title of the loop step executed.
5. ruleChecks: Verification booleans (professionalTone, directAccountability, noOverSharing, policyCompliant).`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            email: {
              type: Type.OBJECT,
              properties: {
                recipientName: { type: Type.STRING },
                recipientEmail: { type: Type.STRING },
                senderName: { type: Type.STRING },
                senderEmail: { type: Type.STRING },
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
              description: "Applicable UC Berkeley policy snippet or citation",
            },
            nextLoopStep: {
              type: Type.INTEGER,
              description: "Next step number in the interaction loop (1 to 4)",
            },
            currentStepName: {
              type: Type.STRING,
              description: "Name of the interaction loop step completed",
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
    res.status(500).json({ error: error.message || "Failed to generate email" });
  }
});

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
