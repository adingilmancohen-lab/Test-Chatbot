import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  Copy, 
  Check, 
  AlertCircle, 
  Mail, 
  BookOpen, 
  ExternalLink,
  History,
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import { GeneratedEmailData, PeerRuleChecks } from './types';
import { Header } from './components/Header';
import { SystemDiagramModal } from './components/SystemDiagramModal';
import { RevisionCard } from './components/RevisionCard';
import { 
  BoschFountain, 
  BoschOwl, 
  BoschStrawberry, 
  BoschCreature, 
  BoschTriptychWings 
} from './components/BoschIcons';

const DEFAULT_PROMPT = "Write a casual email to Hugh letting him know I will miss tomorrow’s Systems studio because I came down with a bad fever and am visiting the Tang Center. Elena is presenting our Figma systems diagram during critique.";

const getInitialEmail = (name: string): GeneratedEmailData => ({
  recipientName: 'Hugh',
  recipientEmail: 'dubberly@berkeley.edu',
  senderName: name,
  senderEmail: `${name.toLowerCase().replace(/[^a-z0-9]/g, '') || 'student'}@berkeley.edu`,
  subject: `DES INV 200: Absence heads up & studio handoff (${name})`,
  salutation: 'Hi Hugh,',
  bodyParagraphs: [
    'Wanted to give you a quick heads up that I won’t be able to make it to tomorrow’s Systems studio. I came down with a pretty bad fever and am heading to the Tang Center today to get checked out.',
    'Elena and I are all synced up on our systems diagram in Figma, so she’s going to pin up and present our progress during critique.',
    'I’ll catch up with Elena on the critique feedback once I’m back on my feet. Thanks so much for understanding!',
  ],
  valediction: 'Best,',
  postscript: 'DES INV 200: Systems | Jacobs Hall 310',
});

const INITIAL_POLICY = "DES INV 200 Syllabus: 2 unexcused absences permitted; missing more than 3 class meetings results in failing the course. If sick, alert faculty in advance. Work is pinned up with partner for critique continuity.";

const INITIAL_CHECKS: PeerRuleChecks = {
  professionalTone: true,
  directAccountability: true,
  noOverSharing: true,
  policyCompliant: true,
};

const EXAMPLE_PROMPTS = [
  {
    label: "Hugh Dubberly: Sickness & Figma handoff",
    subtitle: "DES INV 200 Systems studio handoff",
    prompt: "Write a casual email to Hugh letting him know I will miss Wednesday's Systems studio because I have a fever and am going to the Tang Center. Elena has our Figma systems map ready to present.",
  },
  {
    label: "Chris Myers: PhysComp 3D printer issue",
    subtitle: "DESINV 202 Jacobs Hall queue delay",
    prompt: "Email Chris Myers asking for advice on our PhysComp Project 1 Expressive Mechanics sculpture. The 3D printer queue in Jacobs is backed up, and our servo mount needs to be reprinted before Thursday studio.",
  },
  {
    label: "Joris Komen: Studio appointment conflict",
    subtitle: "bCourses Absence & Tardiness Form",
    prompt: "Write a quick note to Joris Komen letting him know I'll be 20 minutes late to Thursday studio due to a doctor appointment, and confirm I filled out the Absence & Tardiness Form on bCourses.",
  },
  {
    label: "Hugh Dubberly: Concept Map extension request",
    subtitle: "Shannon & Weaver 11x17 diagram",
    prompt: "Ask Hugh for a 24-hour extension on this week's 11x17 concept map for the Shannon and Weaver reading, explaining that our laptop crashed and we want to ensure the knowledge graph is thorough.",
  },
];

async function extractErrorMessage(res: Response, fallback: string): Promise<string> {
  try {
    const errorData = await res.json();
    if (errorData?.error) return errorData.error;
  } catch {
    // Response was not JSON
  }
  if (res.status === 404) {
    return 'API endpoint not found (404). If deployed on Vercel, ensure vercel.json and api/index.ts are deployed and GEMINI_API_KEY is configured in Vercel Environment Variables.';
  }
  return `${fallback} (HTTP ${res.status}: ${res.statusText || 'Server Error'})`;
}

export default function App() {
  const [userName, setUserName] = useState<string>(() => {
    return localStorage.getItem('reliable_peer_user_name') || 'Alex';
  });

  const [prompt, setPrompt] = useState<string>(DEFAULT_PROMPT);
  const [generatedEmail, setGeneratedEmail] = useState<GeneratedEmailData | null>(() => getInitialEmail(userName));
  const [policyReference, setPolicyReference] = useState<string>(INITIAL_POLICY);
  const [ruleChecks, setRuleChecks] = useState<PeerRuleChecks>(INITIAL_CHECKS);
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRevising, setIsRevising] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedEmail, setCopiedEmail] = useState<boolean>(false);
  const [isInfoOpen, setIsInfoOpen] = useState<boolean>(false);
  const [revisionHistory, setRevisionHistory] = useState<string[]>([]);

  const handleNameChange = (newName: string) => {
    setUserName(newName);
    localStorage.setItem('reliable_peer_user_name', newName);

    if (generatedEmail) {
      const cleanName = newName.trim() || 'Student';
      setGeneratedEmail({
        ...generatedEmail,
        senderName: cleanName,
        senderEmail: `${cleanName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'student'}@berkeley.edu`,
      });
    }
  };

  const handleGenerate = async (targetPrompt?: string) => {
    const promptToSend = (targetPrompt !== undefined ? targetPrompt : prompt).trim();
    if (!promptToSend) return;

    setIsLoading(true);
    setErrorMessage(null);

    const activeName = userName.trim() || 'Student';
    const activeEmail = `${activeName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'student'}@berkeley.edu`;

    try {
      const res = await fetch('/api/peer/consult', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: promptToSend,
          senderName: activeName,
          senderEmail: activeEmail,
        }),
      });

      if (!res.ok) {
        const errorText = await extractErrorMessage(res, 'Failed to generate email');
        throw new Error(errorText);
      }

      const data = await res.json();
      if (data.email) {
        setGeneratedEmail(data.email);
        setPolicyReference(data.policyReference || 'Syllabus policy retrieved.');
        if (data.ruleChecks) {
          setRuleChecks(data.ruleChecks);
        }
        setRevisionHistory([]);
      }
    } catch (err: any) {
      console.error('Generation error:', err);
      setErrorMessage(err.message || 'An error occurred while generating the email draft.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRevise = async (feedback: string) => {
    if (!generatedEmail || !feedback.trim()) return;

    setIsRevising(true);
    setErrorMessage(null);

    const activeName = userName.trim() || 'Student';
    const activeEmail = `${activeName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'student'}@berkeley.edu`;

    try {
      const res = await fetch('/api/peer/consult', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          senderName: activeName,
          senderEmail: activeEmail,
          revisionFeedback: feedback.trim(),
          currentEmail: generatedEmail,
        }),
      });

      if (!res.ok) {
        const errorText = await extractErrorMessage(res, 'Failed to revise email');
        throw new Error(errorText);
      }

      const data = await res.json();
      if (data.email) {
        setGeneratedEmail(data.email);
        if (data.policyReference) {
          setPolicyReference(data.policyReference);
        }
        if (data.ruleChecks) {
          setRuleChecks(data.ruleChecks);
        }
        setRevisionHistory(prev => [feedback.trim(), ...prev]);
      }
    } catch (err: any) {
      console.error('Revision error:', err);
      setErrorMessage(err.message || 'An error occurred while revising the email draft.');
    } finally {
      setIsRevising(false);
    }
  };

  const handleCopyEmail = async () => {
    if (!generatedEmail) return;
    const text = [
      `To: ${generatedEmail.recipientEmail || generatedEmail.recipientName}`,
      `Subject: ${generatedEmail.subject}`,
      '',
      generatedEmail.salutation,
      '',
      ...generatedEmail.bodyParagraphs,
      '',
      generatedEmail.valediction,
      generatedEmail.senderName,
      generatedEmail.postscript ? `\n${generatedEmail.postscript}` : '',
    ].join('\n');

    await navigator.clipboard.writeText(text);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleReset = () => {
    setPrompt('');
    setGeneratedEmail(null);
    setErrorMessage(null);
    setRevisionHistory([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      handleGenerate();
    }
  };

  const getMailtoUrl = () => {
    if (!generatedEmail) return '#';
    const recipient = encodeURIComponent(generatedEmail.recipientEmail || '');
    const subject = encodeURIComponent(generatedEmail.subject);
    const body = encodeURIComponent([
      generatedEmail.salutation,
      '',
      ...generatedEmail.bodyParagraphs,
      '',
      generatedEmail.valediction,
      generatedEmail.senderName,
      generatedEmail.postscript ? `\n${generatedEmail.postscript}` : '',
    ].join('\n'));
    return `mailto:${recipient}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#161811] text-[#e8dfc8] selection:bg-[#c13e48]/40 selection:text-[#fff6df]">
      
      {/* Header Styled with Renaissance Gilded Trim */}
      <Header
        email={generatedEmail}
        onOpenSystemDiagram={() => setIsInfoOpen(true)}
        onReset={handleReset}
      />

      {/* Decorative Triptych Wing Arch Banner */}
      <div className="w-full bg-[#1b1e15] border-b border-[#3d3321] py-2 px-4 text-center text-xs font-serif text-[#b8a989] flex items-center justify-center gap-3 overflow-hidden">
        <span className="text-[#d4af37] font-medieval flex items-center gap-1.5">
          <BoschOwl className="w-4 h-4 text-[#d4af37]" />
          Left Shutter: Creation & Syllabus Intent
        </span>
        <span className="text-[#594022]">♦</span>
        <span className="text-[#f4d35e] font-medieval flex items-center gap-1.5">
          <BoschFountain className="w-4 h-4 text-[#e06b75]" />
          Center Panel: Earthly Missives & Studio Dialogue
        </span>
        <span className="text-[#594022] hidden sm:inline">♦</span>
        <span className="text-[#e06b75] font-medieval hidden sm:flex items-center gap-1.5">
          <BoschCreature className="w-4 h-4 text-[#a33845]" />
          Right Shutter: Jacobs Hall Handoff & Revision
        </span>
      </div>

      {/* Main Workspace: 2-Column Renaissance Triptych Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-6">
        
        {/* Left Column (Left Triptych Shutter): User Identity & Prompt Input */}
        <section className="w-full lg:w-1/2 flex flex-col space-y-4">
          
          <div className="bg-[#1f2219] p-5 sm:p-6 rounded-xl border-2 border-[#544129] shadow-2xl flex-1 flex flex-col relative overflow-hidden">
            {/* Gilded Corner Accents */}
            <div className="absolute top-1 left-1 w-3 h-3 border-t-2 border-l-2 border-[#d4af37]" />
            <div className="absolute top-1 right-1 w-3 h-3 border-t-2 border-r-2 border-[#d4af37]" />
            <div className="absolute bottom-1 left-1 w-3 h-3 border-b-2 border-l-2 border-[#d4af37]" />
            <div className="absolute bottom-1 right-1 w-3 h-3 border-b-2 border-r-2 border-[#d4af37]" />

            {/* Box Header with User Name input */}
            <div className="mb-4 space-y-3.5">
              <div className="flex items-center justify-between border-b border-[#3d3321] pb-3">
                <h2 className="text-base sm:text-lg font-bold text-[#f5d77f] font-almendra flex items-center gap-2">
                  <BoschCreature className="w-5 h-5 text-[#e06b75]" />
                  <span>The Scribe's Invocation</span>
                </h2>
                <span className="text-[11px] font-medieval text-[#a8997a] bg-[#29261a] border border-[#54462e] px-2.5 py-0.5 rounded">
                  Panel I: Student Intent
                </span>
              </div>

              {/* User Name Input Bar */}
              <div className="bg-[#282a1e] p-3.5 rounded-lg border-2 border-[#59472e] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-inner">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#181912] border border-[#d4af37] text-[#d4af37] flex items-center justify-center font-bold text-xs shrink-0 shadow-md">
                    <BoschOwl className="w-4 h-4 text-[#f5d77f]" />
                  </div>
                  <div>
                    <label 
                      htmlFor="user-name-input"
                      className="text-xs font-bold text-[#f5d77f] font-almendra block tracking-wider"
                    >
                      Scribe / Student Name:
                    </label>
                    <span className="text-[10px] text-[#9a8c72] font-serif italic">
                      Inscribes sign-off & studio valediction
                    </span>
                  </div>
                </div>

                <div className="w-full sm:w-auto">
                  <input
                    id="user-name-input"
                    type="text"
                    value={userName}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="Enter your name (e.g. Alex, Maya)"
                    className="w-full sm:w-52 px-3 py-1.5 text-xs text-[#2c2214] font-semibold bg-[#faf3e3] border-2 border-[#8b6b23] rounded-md focus:outline-none focus:ring-2 focus:ring-[#d4af37]/60 focus:border-[#d4af37] transition-all font-serif"
                  />
                </div>
              </div>

              <p className="text-xs text-[#a89b7e] font-serif leading-relaxed">
                Inscribe your studio petition below. Grounded strictly in the Fall 2026 DESINV 202 & DES INV 200 course covenants at Jacobs Hall.
              </p>
            </div>

            {/* Prompt Input Box styled like an ancient illuminated scriptorium parchment */}
            <div className="flex-1 flex flex-col min-h-[190px]">
              <textarea
                id="user-prompt-input"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="e.g. Write a casual email to Hugh letting him know I will miss tomorrow's studio due to a fever. Elena will pin up our diagram, and I'll catch up with her on feedback."
                className="w-full flex-1 p-4 text-sm text-[#2b2214] bg-[#f7eedc] placeholder:text-[#8a7a63] border-2 border-[#826639] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37]/60 focus:border-[#d4af37] transition-all resize-none leading-relaxed font-serif shadow-inner"
              />
            </div>

            {/* Primary Action Button */}
            <div className="mt-4 flex items-center justify-between gap-3">
              <div className="text-[11px] text-[#8e8169] font-serif italic hidden sm:block">
                Press <kbd className="px-1.5 py-0.5 bg-[#282a1f] border border-[#52442d] rounded text-[#d4af37] font-mono text-[10px]">⌘ + Enter</kbd> to inscribe
              </div>

              <button
                id="generate-email-btn"
                onClick={() => handleGenerate()}
                disabled={isLoading || !prompt.trim()}
                className={`px-5 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all shadow-lg font-medieval tracking-wide ${
                  isLoading || !prompt.trim()
                    ? 'bg-[#2b2b20] text-stone-500 cursor-not-allowed border border-[#3d3d2c]'
                    : 'bg-gradient-to-b from-[#e06b75] to-[#a33845] hover:from-[#eb7d86] hover:to-[#b84351] text-white border border-[#f4a5ae] active:scale-95'
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Consulting Course Codex...</span>
                  </>
                ) : (
                  <>
                    <BoschStrawberry className="w-4 h-4 text-[#ffd166]" />
                    <span>Draft Studio Missive</span>
                  </>
                )}
              </button>
            </div>

            {/* Error Message Box */}
            {errorMessage && (
              <div className="mt-4 p-3 bg-[#38181b] border-2 border-[#a33845] rounded-lg text-xs text-[#f7b5bc] flex items-start gap-2.5 animate-in fade-in duration-200">
                <AlertCircle className="w-4 h-4 text-[#e06b75] shrink-0 mt-0.5" />
                <div className="flex-1 font-serif">
                  <div className="font-bold text-[#fce2e5]">Scriptorium Disturbance:</div>
                  <div className="mt-0.5">{errorMessage}</div>
                </div>
              </div>
            )}

            {/* Example Prompt Chips styled like antique illuminations */}
            <div className="mt-6 pt-4 border-t border-[#3d3321]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#d4af37] font-almendra block mb-2.5 flex items-center gap-1.5">
                <BoschFountain className="w-3.5 h-3.5 text-[#e06b75]" />
                Prompt Manuscripts (Select to invoke)
              </span>
              <div className="space-y-2">
                {EXAMPLE_PROMPTS.map((ex, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setPrompt(ex.prompt);
                      handleGenerate(ex.prompt);
                    }}
                    className="w-full text-left p-2.5 rounded-lg bg-[#272a1e] hover:bg-[#343827] border border-[#52442e] hover:border-[#d4af37] text-xs text-[#dcd1b5] hover:text-[#fff4dc] transition-all flex items-center justify-between group shadow-xs"
                  >
                    <div>
                      <div className="font-semibold font-almendra text-[#f5d77f] group-hover:text-white flex items-center gap-1.5">
                        <span className="text-[#a48858] text-[10px]">§{idx + 1}</span>
                        {ex.label}
                      </div>
                      <div className="text-[10px] text-[#8e8169] font-serif italic">
                        {ex.subtitle}
                      </div>
                    </div>
                    <span className="text-[11px] text-[#d4af37] group-hover:translate-x-1 transition-transform shrink-0 font-medieval font-bold">
                      Invoke ➔
                    </span>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Quick Syllabus & System Info Callout */}
          <div className="bg-[#24281b] border-2 border-[#59482d] p-3.5 rounded-xl flex items-center justify-between text-xs text-[#e2d5ba] shadow-lg">
            <div className="flex items-center gap-2.5">
              <BoschOwl className="w-5 h-5 text-[#d4af37] shrink-0" />
              <span className="font-serif">Grounded in Fall 2026 DESINV 202 & DES INV 200 syllabi.</span>
            </div>
            <button
              onClick={() => setIsInfoOpen(true)}
              className="px-3 py-1 bg-gradient-to-b from-[#d4af37] to-[#8b6b23] hover:from-[#f5d77f] hover:to-[#a4812a] text-[#1c1a11] font-bold rounded text-[11px] transition-all font-medieval tracking-wide shadow-xs"
            >
              Open Codex Diagram
            </button>
          </div>

        </section>

        {/* Right Column (Center & Right Panels): Generated Email Output, Revision Feedback, & Policy Grounding */}
        <section className="w-full lg:w-1/2 flex flex-col space-y-4">
          
          <div className="bg-[#1f2219] p-5 sm:p-6 rounded-xl border-2 border-[#544129] shadow-2xl flex-1 flex flex-col relative overflow-hidden">
            {/* Gilded Corner Accents */}
            <div className="absolute top-1 left-1 w-3 h-3 border-t-2 border-l-2 border-[#d4af37]" />
            <div className="absolute top-1 right-1 w-3 h-3 border-t-2 border-r-2 border-[#d4af37]" />
            <div className="absolute bottom-1 left-1 w-3 h-3 border-b-2 border-l-2 border-[#d4af37]" />
            <div className="absolute bottom-1 right-1 w-3 h-3 border-b-2 border-r-2 border-[#d4af37]" />

            {/* Output Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-[#3d3321]">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-[#f5d77f] font-almendra flex items-center gap-2">
                  <BoschFountain className="w-5 h-5 text-[#e06b75]" />
                  <span>The Completed Epistle</span>
                </h2>
                <p className="text-xs text-[#a89b7e] font-serif italic mt-0.5">
                  Inscribed by <span className="font-bold text-[#f5d77f] not-italic">{userName || 'Student'}</span> for Jacobs Hall faculty.
                </p>
              </div>

              {generatedEmail && (
                <div className="flex items-center gap-2">
                  <button
                    id="copy-email-body-btn"
                    onClick={handleCopyEmail}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md border-2 border-[#7a5832] bg-[#2a2417] hover:bg-[#383120] text-[#f5d77f] transition-colors shadow-sm font-medieval"
                  >
                    {copiedEmail ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-300">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-[#d4af37]" />
                        <span>Copy Text</span>
                      </>
                    )}
                  </button>

                  <a
                    href={getMailtoUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-md bg-gradient-to-b from-[#2d6a4f] to-[#1b4332] hover:from-[#40916c] hover:to-[#2d6a4f] text-[#fefae0] border border-[#52b788] transition-colors shadow-sm font-medieval"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>Open in bMail</span>
                  </a>
                </div>
              )}
            </div>

            {/* Email Content Canvas Styled as Renaissance Parchment Scroll */}
            {generatedEmail ? (
              <div className="mt-4 flex-1 flex flex-col justify-between space-y-4">
                
                {/* Email Metadata Envelope */}
                <div className="bg-[#27291d] p-3.5 rounded-lg border-2 border-[#54462e] text-xs space-y-1.5 font-serif text-[#d6c7a6] shadow-md">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#f5d77f] w-16 shrink-0 font-almendra">Recipient:</span>
                    <span className="text-[#64b5f6] font-semibold">{generatedEmail.recipientName}</span>
                    {generatedEmail.recipientEmail && (
                      <span className="text-[#8e8169] text-[11px]">({generatedEmail.recipientEmail})</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#f5d77f] w-16 shrink-0 font-almendra">Sender:</span>
                    <span className="text-[#f7f0df] font-semibold">{generatedEmail.senderName}</span>
                  </div>
                  <div className="flex items-center gap-2 pt-1 border-t border-[#3d3321]">
                    <span className="font-bold text-[#f5d77f] w-16 shrink-0 font-almendra">Subject:</span>
                    <span className="text-[#ffd166] font-bold">{generatedEmail.subject}</span>
                  </div>
                </div>

                {/* Email Letter Text Paper styled as Bosch illuminated manuscript */}
                <div className="bg-[#f6eedb] p-5 sm:p-7 rounded-xl border-4 border-[#8b6b23] text-[#2c2014] text-sm font-serif leading-relaxed shadow-2xl flex-1 space-y-4 relative overflow-hidden bosch-parchment">
                  {/* Decorative ornamental initial letter motif */}
                  <div className="flex items-baseline gap-2">
                    <span className="w-7 h-7 rounded bg-[#8b263e] text-[#f5d77f] font-almendra font-bold text-base flex items-center justify-center shrink-0 border border-[#d4af37] shadow-xs">
                      {generatedEmail.salutation.charAt(0)}
                    </span>
                    <p className="font-bold text-[#3d2716] font-almendra text-base">
                      {generatedEmail.salutation}
                    </p>
                  </div>
                  
                  {generatedEmail.bodyParagraphs.map((para, idx) => (
                    <p key={idx} className="text-[#2c2014] leading-relaxed text-justify">
                      {para}
                    </p>
                  ))}

                  <div className="pt-3 border-t border-[#d4c39c]">
                    <p className="font-medium italic text-[#594022]">{generatedEmail.valediction}</p>
                    <p className="font-bold text-[#3d2716] font-almendra text-base mt-1 tracking-wide">
                      {generatedEmail.senderName}
                    </p>
                  </div>

                  {generatedEmail.postscript && (
                    <p className="text-xs font-serif text-[#7a5832] italic pt-2 border-t border-[#d4c39c]/80 flex items-center gap-1.5">
                      <BoschStrawberry className="w-3.5 h-3.5 text-[#c13e48] shrink-0" />
                      <span>{generatedEmail.postscript}</span>
                    </p>
                  )}
                </div>

                {/* REVISION FEATURE: Feedback input to revise email */}
                <RevisionCard
                  onRevise={handleRevise}
                  isRevising={isRevising}
                  disabled={isLoading}
                />

                {/* Revision History Log (if revised) */}
                {revisionHistory.length > 0 && (
                  <div className="bg-[#29261a] p-3 rounded-lg border border-[#6b5534] text-xs space-y-1">
                    <div className="flex items-center gap-1.5 font-semibold text-[#f5d77f] font-almendra">
                      <History className="w-3.5 h-3.5 text-[#d4af37]" />
                      <span>Scriptorium Transmutations Applied ({revisionHistory.length}):</span>
                    </div>
                    <ul className="list-disc pl-5 text-[#c7b795] text-[11px] space-y-0.5 font-serif italic">
                      {revisionHistory.map((rev, idx) => (
                        <li key={idx}>"{rev}"</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Policy Citation & Rule Compliance Card styled like an illuminated gloss */}
                <div className="bg-[#27291d] p-4 rounded-lg border-2 border-[#54462e] space-y-2.5 shadow-md">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#f5d77f] font-almendra flex items-center gap-1.5 tracking-wider">
                      <BookOpen className="w-4 h-4 text-[#d4af37]" />
                      <span>Syllabus Policy Citation (Jacobs Hall Covenant):</span>
                    </span>
                    <span className="text-[10px] font-medieval text-[#a8997a]">MDes Knowledge Base</span>
                  </div>
                  
                  <p className="text-xs text-[#dcd1b5] leading-normal italic pl-3 border-l-2 border-[#d4af37] font-serif">
                    "{policyReference}"
                  </p>

                  {/* Rule Checks Pill Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                    <div className="flex items-center gap-1.5 text-[11px] text-[#e8dfc8] bg-[#1a1c14] p-1.5 rounded border border-[#4a3f2c]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate font-serif">First-Name Basis</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-[#e8dfc8] bg-[#1a1c14] p-1.5 rounded border border-[#4a3f2c]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate font-serif">Actual Draft</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-[#e8dfc8] bg-[#1a1c14] p-1.5 rounded border border-[#4a3f2c]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate font-serif">Tang Privacy</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-[#e8dfc8] bg-[#1a1c14] p-1.5 rounded border border-[#4a3f2c]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate font-serif">Jacobs Continuity</span>
                    </div>
                  </div>
                </div>

              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-[#8e8169] space-y-3 font-serif">
                <BoschFountain className="w-12 h-12 text-[#a89b7e] opacity-40" />
                <div>
                  <h3 className="text-sm font-semibold text-[#c7b795] font-almendra text-base">The Parchment Awaits Your Ink</h3>
                  <p className="text-xs text-[#8e8169] max-w-xs mt-1 italic">
                    Inscribe your student name and prompt on the left, then command the scribe to draft.
                  </p>
                </div>
              </div>
            )}

          </div>

        </section>

      </main>

      {/* System Diagram Modal */}
      <SystemDiagramModal
        isOpen={isInfoOpen}
        onClose={() => setIsInfoOpen(false)}
        currentPrompt={prompt}
        userName={userName}
      />

    </div>
  );
}
