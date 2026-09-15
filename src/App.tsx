import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Wand2, 
  ShieldCheck, 
  Palette, 
  PenTool, 
  Check, 
  AlertCircle,
  Bot,
  School,
  Cpu
} from 'lucide-react';
import { 
  LetterData, 
  LetterCategory, 
  LetterTone, 
  LetterLength, 
  LetterTemplate, 
  CritiqueResult,
  InteractionLoopStep,
  PeerInteractionTurn,
  PeerConsultResponse
} from './types';
import { DEFAULT_LETTER, loadSavedLetters, saveLettersToStorage } from './utils/letterStorage';
import { Header } from './components/Header';
import { LetterCanvas } from './components/LetterCanvas';
import { ReliablePeerPanel } from './components/ReliablePeerPanel';
import { SystemDiagramModal } from './components/SystemDiagramModal';
import { DraftingPanel } from './components/DraftingPanel';
import { RefinementPanel } from './components/RefinementPanel';
import { CritiquePanel } from './components/CritiquePanel';
import { StyleControls } from './components/StyleControls';
import { TemplatePickerModal } from './components/TemplatePickerModal';
import { SavedLettersModal } from './components/SavedLettersModal';
import { ReplyAssistantModal } from './components/ReplyAssistantModal';

type SidebarTab = 'peer' | 'draft' | 'refine' | 'critique' | 'style';

const INITIAL_PEER_TURN: PeerInteractionTurn = {
  id: 'starter-turn',
  timestamp: new Date().toISOString(),
  step: 1,
  stepName: 'Casual absence note to Hugh',
  userAsk: 'Write a casual email to Hugh letting him know I will miss tomorrow’s Systems studio because I’m sick.',
  specificOutput: 'Casual email draft to Hugh',
  additionalInfo: 'Severe fever; heading to Tang Center; Elena is pinning up our systems diagram for critique.',
  generatedEmail: {
    recipientName: 'Hugh',
    recipientEmail: 'dubberly@berkeley.edu',
    senderName: 'Yuwen',
    senderEmail: 'yuwen@berkeley.edu',
    subject: 'DES INV 200: Absence heads up & studio handoff (Yuwen)',
    salutation: 'Hi Hugh,',
    bodyParagraphs: [
      'Wanted to give you a quick heads up that I won’t be able to make it to tomorrow’s Systems studio. I came down with a pretty bad fever and am heading to the Tang Center today to get checked out.',
      'Elena and I are all synced up on our systems diagram in Figma, so she’s going to pin up and present our progress during critique.',
      'I’ll catch up with Elena on the critique feedback once I’m back on my feet. Thanks so much for understanding!',
    ],
    valediction: 'Best,',
    postscript: 'DES INV 200: Systems | Jacobs 310',
  },
  policyReference: 'UC Berkeley Academic Senate Regulation A207 & UHS Tang Center medical excuse guidelines.',
  ruleChecks: {
    professionalTone: true,
    directAccountability: true,
    noOverSharing: true,
    policyCompliant: true,
  },
};

async function extractErrorMessage(res: Response, fallback: string): Promise<string> {
  try {
    const errorData = await res.json();
    if (errorData?.error) return errorData.error;
  } catch {
    // Response was not JSON (e.g. Vercel 404 HTML or 500 HTML)
  }
  if (res.status === 404) {
    return 'API endpoint not found (404). If deployed on Vercel, ensure vercel.json and api/index.ts are deployed and GEMINI_API_KEY is configured in Vercel Environment Variables.';
  }
  return `${fallback} (HTTP ${res.status}: ${res.statusText || 'Server Error'})`;
}

export default function App() {
  const [letters, setLetters] = useState<LetterData[]>(() => loadSavedLetters());
  const [currentLetterId, setCurrentLetterId] = useState<string>(() => {
    const loaded = loadSavedLetters();
    return loaded[0]?.id || DEFAULT_LETTER.id;
  });

  const [activeTab, setActiveTab] = useState<SidebarTab>('peer');
  const [undoStack, setUndoStack] = useState<LetterData[]>([]);

  // Reliable Peer state
  const [activeLoopStep, setActiveLoopStep] = useState<InteractionLoopStep>(2);
  const [peerHistory, setPeerHistory] = useState<PeerInteractionTurn[]>([INITIAL_PEER_TURN]);
  const [isPeerConsulting, setIsPeerConsulting] = useState(false);
  const [peerError, setPeerError] = useState<string | null>(null);

  // System Diagram Modal
  const [isSystemDiagramOpen, setIsSystemDiagramOpen] = useState(false);

  // Async states
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [rephrasingIndex, setRephrasingIndex] = useState<number | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [lastEditSummary, setLastEditSummary] = useState<string | null>(null);
  const [critiqueResult, setCritiqueResult] = useState<CritiqueResult | null>(null);

  // Modals
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
  const [isSavedOpen, setIsSavedOpen] = useState(false);
  const [isReplyOpen, setIsReplyOpen] = useState(false);

  // Derive current letter safely
  const currentLetter: LetterData = 
    letters.find((l) => l.id === currentLetterId) || letters[0] || DEFAULT_LETTER;

  // Persist to storage
  useEffect(() => {
    saveLettersToStorage(letters);
  }, [letters]);

  // Update current letter
  const updateLetter = (updated: LetterData, pushToUndo = false) => {
    if (pushToUndo) {
      setUndoStack((prev) => [currentLetter, ...prev.slice(0, 9)]);
    }
    setLetters((prev) =>
      prev.map((l) => (l.id === updated.id ? updated : l))
    );
  };

  const handleTitleUpdate = (newTitle: string) => {
    updateLetter({
      ...currentLetter,
      title: newTitle,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleUndo = () => {
    if (undoStack.length === 0) return;
    const [previous, ...rest] = undoStack;
    setUndoStack(rest);
    updateLetter(previous, false);
    setLastEditSummary('Reverted to previous revision.');
  };

  // Reliable Peer Consult
  const handleConsultPeer = async (inputs: {
    initialAsk: string;
    specificOutput: string;
    additionalInfo: string;
  }) => {
    setIsPeerConsulting(true);
    setPeerError(null);

    try {
      const response = await fetch('/api/peer/consult', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          initialAsk: inputs.initialAsk,
          specificOutput: inputs.specificOutput,
          additionalInfo: inputs.additionalInfo,
          currentLoopStep: activeLoopStep,
          conversationHistory: peerHistory.map((h) => ({
            role: 'user',
            content: h.userAsk,
          })),
        }),
      });

      if (!response.ok) {
        const errorMsg = await extractErrorMessage(response, 'Failed to generate email.');
        throw new Error(errorMsg);
      }

      const result: PeerConsultResponse = await response.json();

      const newTurn: PeerInteractionTurn = {
        id: `peer-${Date.now()}`,
        timestamp: new Date().toISOString(),
        step: activeLoopStep,
        stepName: result.currentStepName,
        userAsk: inputs.initialAsk,
        specificOutput: inputs.specificOutput,
        additionalInfo: inputs.additionalInfo,
        generatedEmail: result.email,
        policyReference: result.policyReference,
        ruleChecks: result.ruleChecks,
      };

      setPeerHistory((prev) => [...prev, newTurn]);
      if (result.nextLoopStep) {
        setActiveLoopStep(result.nextLoopStep);
      }

      // Automatically update the canvas with the generated email to Professor Hugh Dubberly
      if (result.email) {
        updateLetter(
          {
            ...currentLetter,
            subject: result.email.subject || currentLetter.subject,
            salutation: result.email.salutation || currentLetter.salutation,
            bodyParagraphs: result.email.bodyParagraphs || currentLetter.bodyParagraphs,
            valediction: result.email.valediction || currentLetter.valediction,
            postscript: result.email.postscript || currentLetter.postscript,
            recipient: {
              ...currentLetter.recipient,
              name: result.email.recipientName || 'Hugh',
              contact: result.email.recipientEmail || 'dubberly@berkeley.edu',
            },
            sender: {
              ...currentLetter.sender,
              name: result.email.senderName || 'Yuwen',
              contact: result.email.senderEmail || 'yuwen@berkeley.edu',
            },
            toneAssessment: 'Casual, direct email to Hugh adhering to UC Berkeley MDes studio norms.',
            updatedAt: new Date().toISOString(),
          },
          true
        );
        setLastEditSummary(`Generated casual email to Hugh (Step ${activeLoopStep}).`);
      }
    } catch (err: any) {
      console.error(err);
      setPeerError(err.message || 'Error generating email.');
    } finally {
      setIsPeerConsulting(false);
    }
  };

  const handleApplyDraftLetter = (email: PeerConsultResponse['email']) => {
    updateLetter(
      {
        ...currentLetter,
        subject: email.subject,
        salutation: email.salutation,
        bodyParagraphs: email.bodyParagraphs,
        valediction: email.valediction,
        postscript: email.postscript || currentLetter.postscript,
        recipient: {
          ...currentLetter.recipient,
          name: email.recipientName,
          contact: email.recipientEmail,
        },
        sender: {
          ...currentLetter.sender,
          name: email.senderName,
          contact: email.senderEmail,
        },
        updatedAt: new Date().toISOString(),
      },
      true
    );
    setLastEditSummary('Applied generated email to letter canvas.');
  };

  // 1. Generate full draft from user prompt
  const handleGenerateDraft = async (params: {
    purpose: string;
    keyPoints: string;
    category: LetterCategory;
    tone: LetterTone;
    length: LetterLength;
    senderName: string;
    senderTitle: string;
    senderOrg: string;
    recipientName: string;
    recipientTitle: string;
    recipientOrg: string;
  }) => {
    setIsGenerating(true);
    setApiError(null);

    try {
      const res = await fetch('/api/letter/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...params,
          date: currentLetter.date,
        }),
      });

      if (!res.ok) {
        const errorMsg = await extractErrorMessage(res, 'Failed to draft letter');
        throw new Error(errorMsg);
      }

      const generated = await res.json();

      const updated: LetterData = {
        ...currentLetter,
        category: params.category,
        tone: params.tone,
        length: params.length,
        subject: generated.subject || currentLetter.subject,
        salutation: generated.salutation || currentLetter.salutation,
        bodyParagraphs: generated.bodyParagraphs || currentLetter.bodyParagraphs,
        valediction: generated.valediction || currentLetter.valediction,
        postscript: generated.postscript || '',
        toneAssessment: generated.toneAssessment,
        writingTips: generated.writingTips,
        sender: {
          ...currentLetter.sender,
          name: params.senderName || currentLetter.sender.name,
          title: params.senderTitle || currentLetter.sender.title,
          organization: params.senderOrg || currentLetter.sender.organization,
        },
        recipient: {
          ...currentLetter.recipient,
          name: params.recipientName || currentLetter.recipient.name,
          title: params.recipientTitle || currentLetter.recipient.title,
          organization: params.recipientOrg || currentLetter.recipient.organization,
        },
        updatedAt: new Date().toISOString(),
      };

      updateLetter(updated, true);
      setLastEditSummary('Generated full customized draft.');
    } catch (err: any) {
      setApiError(err.message || 'Error communicating with AI service');
    } finally {
      setIsGenerating(false);
    }
  };

  // 2. Refine existing letter
  const handleRefine = async (action: string, customInstruction?: string) => {
    setIsRefining(true);
    setApiError(null);

    try {
      const res = await fetch('/api/letter/refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentLetter: {
            subject: currentLetter.subject,
            salutation: currentLetter.salutation,
            bodyParagraphs: currentLetter.bodyParagraphs,
            valediction: currentLetter.valediction,
            postscript: currentLetter.postscript,
          },
          action,
          customInstruction,
        }),
      });

      if (!res.ok) {
        const errorMsg = await extractErrorMessage(res, 'Failed to refine letter');
        throw new Error(errorMsg);
      }

      const refined = await res.json();

      const updated: LetterData = {
        ...currentLetter,
        subject: refined.subject ?? currentLetter.subject,
        salutation: refined.salutation ?? currentLetter.salutation,
        bodyParagraphs: refined.bodyParagraphs ?? currentLetter.bodyParagraphs,
        valediction: refined.valediction ?? currentLetter.valediction,
        postscript: refined.postscript ?? currentLetter.postscript,
        updatedAt: new Date().toISOString(),
      };

      updateLetter(updated, true);
      setLastEditSummary(refined.editSummary || 'Applied AI refinement.');
    } catch (err: any) {
      setApiError(err.message || 'Error applying refinement');
    } finally {
      setIsRefining(false);
    }
  };

  // 3. Rephrase a single paragraph inline
  const handleRephraseParagraph = async (index: number, text: string) => {
    setRephrasingIndex(index);
    setApiError(null);

    try {
      const res = await fetch('/api/letter/refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentLetter: {
            bodyParagraphs: [text],
          },
          action: 'polish',
          customInstruction: 'Rephrase this single paragraph to be engaging, articulate, and natural.',
        }),
      });

      if (!res.ok) {
        const errorMsg = await extractErrorMessage(res, 'Failed to rephrase paragraph');
        throw new Error(errorMsg);
      }

      const data = await res.json();
      if (data.bodyParagraphs && data.bodyParagraphs[0]) {
        const newParas = [...currentLetter.bodyParagraphs];
        newParas[index] = data.bodyParagraphs[0];
        updateLetter({ ...currentLetter, bodyParagraphs: newParas }, true);
        setLastEditSummary(`Rephrased paragraph ${index + 1}.`);
      }
    } catch (err: any) {
      setApiError(err.message || 'Error rephrasing paragraph');
    } finally {
      setRephrasingIndex(null);
    }
  };

  // 4. Critique letter
  const handleRunCritique = async (audience: string): Promise<CritiqueResult | null> => {
    setIsAnalyzing(true);
    setApiError(null);

    try {
      const res = await fetch('/api/letter/critique', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          letter: {
            subject: currentLetter.subject,
            salutation: currentLetter.salutation,
            bodyParagraphs: currentLetter.bodyParagraphs,
            valediction: currentLetter.valediction,
          },
          intendedAudience: audience,
        }),
      });

      if (!res.ok) {
        const errorMsg = await extractErrorMessage(res, 'Failed to analyze letter');
        throw new Error(errorMsg);
      }

      const result: CritiqueResult = await res.json();
      setCritiqueResult(result);
      return result;
    } catch (err: any) {
      setApiError(err.message || 'Error running critique');
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 5. Apply reply from Reply Assistant
  const handleApplyReply = (replyData: {
    subject: string;
    salutation: string;
    bodyParagraphs: string[];
    valediction: string;
    postscript?: string;
  }) => {
    const newDraft: LetterData = {
      ...currentLetter,
      id: `draft-${Date.now()}`,
      title: replyData.subject ? `Reply: ${replyData.subject}` : 'Formal Reply Letter',
      subject: replyData.subject,
      salutation: replyData.salutation,
      bodyParagraphs: replyData.bodyParagraphs,
      valediction: replyData.valediction,
      postscript: replyData.postscript || '',
      updatedAt: new Date().toISOString(),
    };

    setLetters((prev) => [newDraft, ...prev]);
    setCurrentLetterId(newDraft.id);
    setLastEditSummary('Drafted targeted reply to received letter.');
  };

  // 6. Template loader
  const handleSelectTemplate = (template: LetterTemplate) => {
    const newDraft: LetterData = {
      ...DEFAULT_LETTER,
      id: `draft-${Date.now()}`,
      title: template.name,
      category: template.category,
      tone: template.tone,
      subject: template.name,
      salutation: `Dear ${template.defaultRecipientTitle},`,
      bodyParagraphs: [
        template.previewSnippet,
        `In addressing ${template.purpose.toLowerCase()}, I want to highlight key facts: ${template.keyPoints}`,
        'Thank you for your consideration and time regarding this matter.',
      ],
      updatedAt: new Date().toISOString(),
    };

    setLetters((prev) => [newDraft, ...prev]);
    setCurrentLetterId(newDraft.id);
    setActiveTab('draft');
  };

  // 7. New blank letter
  const handleNewLetter = () => {
    const newDraft: LetterData = {
      ...DEFAULT_LETTER,
      id: `draft-${Date.now()}`,
      title: 'New Letter Draft',
      subject: '',
      salutation: 'Dear [Recipient Name],',
      bodyParagraphs: ['Write your letter content here, or use the AI Draft tab to generate a complete letter.'],
      valediction: 'Sincerely,',
      postscript: '',
      updatedAt: new Date().toISOString(),
    };

    setLetters((prev) => [newDraft, ...prev]);
    setCurrentLetterId(newDraft.id);
    setActiveTab('draft');
  };

  // 8. Duplicate draft
  const handleDuplicateLetter = (letterToDup: LetterData) => {
    const duplicated: LetterData = {
      ...letterToDup,
      id: `draft-${Date.now()}`,
      title: `${letterToDup.title} (Copy)`,
      updatedAt: new Date().toISOString(),
    };
    setLetters((prev) => [duplicated, ...prev]);
    setCurrentLetterId(duplicated.id);
  };

  // 9. Delete draft
  const handleDeleteLetter = (idToDelete: string) => {
    if (letters.length <= 1) return;
    const remaining = letters.filter((l) => l.id !== idToDelete);
    setLetters(remaining);
    if (currentLetterId === idToDelete) {
      setCurrentLetterId(remaining[0].id);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-100 text-stone-900 selection:bg-amber-200">
      
      {/* Top Application Bar */}
      <Header
        currentLetter={currentLetter}
        onUpdateTitle={handleTitleUpdate}
        onNewLetter={handleNewLetter}
        onOpenSavedModal={() => setIsSavedOpen(true)}
        onOpenTemplatesModal={() => setIsTemplatesOpen(true)}
        onOpenReplyModal={() => setIsReplyOpen(true)}
        onOpenSystemDiagram={() => setIsSystemDiagramOpen(true)}
        savedCount={letters.length}
        isSaving={false}
      />

      {/* Main Split Layout */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0">
        
        {/* Left Side: Assistant Tools & Tabs */}
        <aside className="no-print w-full lg:w-[420px] xl:w-[460px] bg-white border-r border-stone-200 flex flex-col shrink-0 shadow-xs z-10">
          
          {/* Tabs Navigation */}
          <div className="grid grid-cols-5 border-b border-stone-200 bg-stone-50/90 text-[11px] font-semibold">
            <button
              onClick={() => setActiveTab('peer')}
              className={`py-2.5 px-1 flex flex-col items-center gap-1 border-b-2 transition-all ${
                activeTab === 'peer'
                  ? 'border-[#003262] text-[#003262] bg-white shadow-2xs font-bold'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              <School className={`w-3.5 h-3.5 ${activeTab === 'peer' ? 'text-[#003262]' : 'text-stone-400'}`} />
              <span className="truncate">Reliable Peer</span>
            </button>

            <button
              onClick={() => setActiveTab('draft')}
              className={`py-2.5 px-1 flex flex-col items-center gap-1 border-b-2 transition-all ${
                activeTab === 'draft'
                  ? 'border-amber-600 text-amber-900 bg-white shadow-2xs font-bold'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="truncate">Draft AI</span>
            </button>

            <button
              onClick={() => setActiveTab('refine')}
              className={`py-2.5 px-1 flex flex-col items-center gap-1 border-b-2 transition-all ${
                activeTab === 'refine'
                  ? 'border-amber-600 text-amber-900 bg-white shadow-2xs font-bold'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span className="truncate">Refine</span>
            </button>

            <button
              onClick={() => setActiveTab('critique')}
              className={`py-2.5 px-1 flex flex-col items-center gap-1 border-b-2 transition-all ${
                activeTab === 'critique'
                  ? 'border-amber-600 text-amber-900 bg-white shadow-2xs font-bold'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="truncate">Audit</span>
            </button>

            <button
              onClick={() => setActiveTab('style')}
              className={`py-2.5 px-1 flex flex-col items-center gap-1 border-b-2 transition-all ${
                activeTab === 'style'
                  ? 'border-amber-600 text-amber-900 bg-white shadow-2xs font-bold'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span className="truncate">Stationery</span>
            </button>
          </div>

          {/* Active Tab Content Area */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === 'peer' && (
              <ReliablePeerPanel
                currentLetter={currentLetter}
                interactionHistory={peerHistory}
                activeLoopStep={activeLoopStep}
                onConsultPeer={handleConsultPeer}
                onApplyDraftLetter={handleApplyDraftLetter}
                onOpenSystemDiagram={() => setIsSystemDiagramOpen(true)}
                isLoading={isPeerConsulting}
                error={peerError}
              />
            )}

            {activeTab === 'draft' && (
              <DraftingPanel
                currentLetter={currentLetter}
                onGenerateDraft={handleGenerateDraft}
                isGenerating={isGenerating}
                error={apiError}
              />
            )}

            {activeTab === 'refine' && (
              <RefinementPanel
                currentLetter={currentLetter}
                onRefine={handleRefine}
                isRefining={isRefining}
                onUndo={handleUndo}
                canUndo={undoStack.length > 0}
                lastEditSummary={lastEditSummary}
              />
            )}

            {activeTab === 'critique' && (
              <CritiquePanel
                currentLetter={currentLetter}
                onRunCritique={handleRunCritique}
                critiqueResult={critiqueResult}
                isAnalyzing={isAnalyzing}
              />
            )}

            {activeTab === 'style' && (
              <StyleControls
                currentLetter={currentLetter}
                onChangeStyle={(newStyle) => updateLetter({ ...currentLetter, style: newStyle })}
              />
            )}
          </div>

        </aside>

        {/* Right Side: Interactive Paper Canvas */}
        <main className="flex-1 flex flex-col min-w-0">
          <LetterCanvas
            letter={currentLetter}
            onChange={(updated) => updateLetter(updated, false)}
            onRephraseParagraph={handleRephraseParagraph}
            rephrasingIndex={rephrasingIndex}
          />
        </main>

      </div>

      {/* Modals */}
      <SystemDiagramModal
        isOpen={isSystemDiagramOpen}
        onClose={() => setIsSystemDiagramOpen(false)}
        activeLoopStep={activeLoopStep}
        onSelectLoopStep={(step) => setActiveLoopStep(step)}
      />

      <TemplatePickerModal
        isOpen={isTemplatesOpen}
        onClose={() => setIsTemplatesOpen(false)}
        onSelectTemplate={handleSelectTemplate}
      />

      <SavedLettersModal
        isOpen={isSavedOpen}
        onClose={() => setIsSavedOpen(false)}
        letters={letters}
        currentLetterId={currentLetter.id}
        onSelectLetter={(selected) => setCurrentLetterId(selected.id)}
        onDeleteLetter={handleDeleteLetter}
        onDuplicateLetter={handleDuplicateLetter}
      />

      <ReplyAssistantModal
        isOpen={isReplyOpen}
        onClose={() => setIsReplyOpen(false)}
        onApplyReply={handleApplyReply}
      />

    </div>
  );
}
