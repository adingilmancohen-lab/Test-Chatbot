import React, { useState } from 'react';
import { 
  Mail, 
  Sparkles, 
  CheckCircle2, 
  Copy, 
  Check, 
  ExternalLink, 
  FileText, 
  School,
  AlertCircle,
  MessageSquare,
  ChevronRight,
  Send,
  Cpu,
  ArrowRight,
  History
} from 'lucide-react';
import { 
  LetterData, 
  InteractionLoopStep, 
  PeerInteractionTurn, 
  GeneratedEmailData 
} from '../types';

interface ReliablePeerPanelProps {
  currentLetter: LetterData;
  interactionHistory: PeerInteractionTurn[];
  activeLoopStep: InteractionLoopStep;
  onConsultPeer: (inputs: {
    initialAsk: string;
    specificOutput: string;
    additionalInfo: string;
  }) => Promise<void>;
  onApplyDraftLetter: (email: GeneratedEmailData) => void;
  onOpenSystemDiagram: () => void;
  isLoading: boolean;
  error: string | null;
}

const QUICK_PROMPTS = [
  {
    title: 'Absence Heads Up to Hugh (Sickness)',
    ask: 'Write a casual email to Hugh letting him know I won’t make it to tomorrow’s Systems studio because I’m sick.',
    output: 'Casual email draft to Hugh with studio deliverable handoff plan',
    info: 'Came down with a fever; heading to Tang Center; studio partner Elena will pin up and present our systems diagram.',
  },
  {
    title: 'Missed Studio Critique at Jacobs 310',
    ask: 'Write a casual note to Hugh explaining that I’m too sick to present at tomorrow’s DES INV studio critique.',
    output: 'Friendly email to Hugh proposing partner pin-up and async feedback review',
    info: 'Elena has our Miro board and Figma file ready; asking for async comments or catching up once recovered.',
  },
  {
    title: 'Tang Center Medical Heads Up',
    ask: 'Write a quick casual email to Hugh letting him know I’m resting up after a Tang Center appointment and will miss studio.',
    output: 'Casual studio email with Tang Center heads up',
    info: 'Checked out at Tang Center UHS; doctor advised 48-hour rest; Elena has our systems work covered.',
  },
];

const LOOP_STEP_DETAILS: Record<InteractionLoopStep, { name: string; desc: string }> = {
  1: { name: 'Initial Absence Notice', desc: 'Generates casual heads-up email to Hugh with partner handoff plan.' },
  2: { name: 'Medical Calibrated Email', desc: 'Mentions Tang Center (UHS) checkup in a casual, natural way.' },
  3: { name: 'Studio Deliverables Handoff', desc: 'Details Jacobs Hall critique handoffs in Figma with partner.' },
  4: { name: 'Alternative Arrangement', desc: 'Proposes async review, partner pin-up, or quick chat once better.' },
};

export const ReliablePeerPanel: React.FC<ReliablePeerPanelProps> = ({
  currentLetter,
  interactionHistory,
  activeLoopStep,
  onConsultPeer,
  onApplyDraftLetter,
  onOpenSystemDiagram,
  isLoading,
  error,
}) => {
  const [initialAsk, setInitialAsk] = useState(
    'Write a casual email to Hugh letting him know I won’t make it to tomorrow’s Systems studio because I’m sick.'
  );
  const [specificOutput, setSpecificOutput] = useState(
    'Casual email draft to Hugh'
  );
  const [additionalInfo, setAdditionalInfo] = useState(
    'Came down with a fever; heading to Tang Center today; studio partner Elena has our Figma diagrams and will pin up for critique.'
  );

  const [copied, setCopied] = useState(false);
  const [selectedHistoryIndex, setSelectedHistoryIndex] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!initialAsk.trim()) return;
    setSelectedHistoryIndex(null);
    await onConsultPeer({
      initialAsk,
      specificOutput,
      additionalInfo,
    });
  };

  const handleApplyPreset = (p: typeof QUICK_PROMPTS[0]) => {
    setInitialAsk(p.ask);
    setSpecificOutput(p.output);
    setAdditionalInfo(p.info);
  };

  const activeTurn = selectedHistoryIndex !== null 
    ? interactionHistory[selectedHistoryIndex] 
    : interactionHistory[interactionHistory.length - 1];

  const currentEmail = activeTurn?.generatedEmail;

  const getCleanValediction = () => {
    if (!currentEmail) return 'Best,';
    const val = currentEmail.valediction || 'Best,';
    const sender = currentEmail.senderName || 'Yuwen';
    return val.replace(new RegExp(`\\s*${sender}\\s*$`, 'i'), '').trim();
  };

  const handleCopyEmail = () => {
    if (!currentEmail) return;
    const cleanVal = getCleanValediction();
    const fullText = [
      `To: ${currentEmail.recipientName} <${currentEmail.recipientEmail}>`,
      `From: ${currentEmail.senderName} <${currentEmail.senderEmail}>`,
      `Subject: ${currentEmail.subject}`,
      '',
      currentEmail.salutation,
      '',
      ...currentEmail.bodyParagraphs.map((p) => p + '\n'),
      cleanVal,
      currentEmail.senderName,
      currentEmail.postscript ? `\n${currentEmail.postscript}` : '',
    ].join('\n');

    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getMailtoLink = () => {
    if (!currentEmail) return '#';
    const cleanVal = getCleanValediction();
    const subject = encodeURIComponent(currentEmail.subject);
    const body = encodeURIComponent(
      [
        currentEmail.salutation,
        '',
        ...currentEmail.bodyParagraphs,
        '',
        cleanVal,
        currentEmail.senderName,
      ].join('\n\n')
    );
    return `mailto:${currentEmail.recipientEmail}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="p-4 sm:p-5 space-y-5">
      
      {/* Persona Header Card */}
      <div className="p-3.5 bg-gradient-to-br from-[#003262] to-[#022344] text-white rounded-xl shadow-xs">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#FDB515] text-[#003262] flex items-center justify-center font-bold">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold font-cinzel text-white">Reliable Peer</span>
                <span className="text-[10px] bg-white/20 text-amber-200 px-1.5 py-0.2 rounded font-mono">
                  Casual Studio Tone
                </span>
              </div>
              <p className="text-[11px] text-stone-300">
                Directly generates casual, ready-to-send emails to Hugh on a friendly first-name basis.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenSystemDiagram}
            title="Open System Architecture Diagram"
            className="px-2 py-1 bg-white/10 hover:bg-white/20 border border-white/20 rounded text-[10px] text-amber-300 flex items-center gap-1 font-mono transition-colors"
          >
            <Cpu className="w-3 h-3" />
            <span>Diagram</span>
          </button>
        </div>

        {/* Interaction Loop Tracker */}
        <div className="mt-3 pt-3 border-t border-white/10">
          <div className="flex items-center justify-between text-[11px] mb-1.5 font-medium text-stone-200">
            <span>Interaction Loop:</span>
            <span className="text-[#FDB515] font-semibold">
              Step {activeLoopStep} of 4: {LOOP_STEP_DETAILS[activeLoopStep].name}
            </span>
          </div>

          {/* Stepper Dots */}
          <div className="grid grid-cols-4 gap-1.5">
            {([1, 2, 3, 4] as InteractionLoopStep[]).map((stepNum) => {
              const isPast = stepNum < activeLoopStep;
              const isCurrent = stepNum === activeLoopStep;
              return (
                <div
                  key={stepNum}
                  className={`h-1.5 rounded-full transition-all ${
                    isCurrent
                      ? 'bg-[#FDB515] ring-1 ring-amber-300'
                      : isPast
                      ? 'bg-white/80'
                      : 'bg-white/20'
                  }`}
                />
              );
            })}
          </div>
          <p className="text-[10px] text-stone-300 mt-1 italic">
            {LOOP_STEP_DETAILS[activeLoopStep].desc}
          </p>
        </div>
      </div>

      {/* Quick Scenario Buttons */}
      <div className="space-y-1.5">
        <label className="block text-[11px] font-semibold text-stone-600 uppercase tracking-wider">
          Quick MDes Studio Scenarios
        </label>
        <div className="flex flex-col gap-1.5">
          {QUICK_PROMPTS.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleApplyPreset(p)}
              className="text-left p-2 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 hover:border-amber-500 text-xs transition-all flex items-center justify-between group"
            >
              <span className="text-stone-800 font-medium text-xs truncate group-hover:text-amber-900">
                {p.title}
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-amber-600 shrink-0" />
            </button>
          ))}
        </div>
      </div>

      {/* Required Inputs Form */}
      <form onSubmit={handleSubmit} className="space-y-3 bg-white p-3.5 rounded-xl border border-stone-200 shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-[#003262]" />
            <span>Email Generation Inputs</span>
          </span>
          <span className="text-[10px] text-stone-500 font-mono font-medium">Yuwen &rarr; Hugh</span>
        </div>

        {/* 1. Initial Ask */}
        <div className="space-y-1">
          <label className="block text-[11px] font-semibold text-stone-700">
            1. Email Purpose / Request <span className="text-rose-500">*</span>
          </label>
          <textarea
            value={initialAsk}
            onChange={(e) => setInitialAsk(e.target.value)}
            rows={2}
            required
            placeholder="e.g. Write a casual email to Hugh letting him know I won't make it to studio tomorrow..."
            className="w-full text-xs bg-stone-50 border border-stone-300 rounded-md p-2 text-stone-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#003262]"
          />
        </div>

        {/* 2. Specific Output */}
        <div className="space-y-1">
          <label className="block text-[11px] font-semibold text-stone-700">
            2. Desired Email Format
          </label>
          <input
            type="text"
            value={specificOutput}
            onChange={(e) => setSpecificOutput(e.target.value)}
            placeholder="e.g. Casual email draft to Hugh"
            className="w-full text-xs bg-stone-50 border border-stone-300 rounded-md p-2 text-stone-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#003262]"
          />
        </div>

        {/* 3. Additional Information */}
        <div className="space-y-1">
          <label className="block text-[11px] font-semibold text-stone-700">
            3. Context, Symptoms & Partner Plan
          </label>
          <textarea
            value={additionalInfo}
            onChange={(e) => setAdditionalInfo(e.target.value)}
            rows={2}
            placeholder="e.g. Came down with a fever; heading to Tang Center; Elena has our systems diagram and will pin up..."
            className="w-full text-xs bg-stone-50 border border-stone-300 rounded-md p-2 text-stone-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#003262]"
          />
        </div>

        {error && (
          <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || !initialAsk.trim()}
          className="w-full py-2.5 px-4 bg-[#003262] hover:bg-[#002549] disabled:bg-stone-300 text-white font-semibold text-xs rounded-md shadow-xs transition-all flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Sparkles className="w-3.5 h-3.5 animate-spin text-[#FDB515]" />
              <span>Generating casual email to Hugh...</span>
            </>
          ) : (
            <>
              <Send className="w-3.5 h-3.5 text-[#FDB515]" />
              <span>Generate Email (Step {activeLoopStep})</span>
            </>
          )}
        </button>
      </form>

      {/* Generated Email Container */}
      {currentEmail && (
        <div className="space-y-3 bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
          
          {/* Email Header Bar */}
          <div className="bg-stone-50 p-3 border-b border-stone-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-[#003262]" />
                <span>Generated Email Draft</span>
              </span>
              <span className="text-[10px] font-mono bg-blue-100/80 text-[#003262] px-2 py-0.5 rounded font-semibold">
                Ready to Send
              </span>
            </div>

            {/* Email Metadata Headers */}
            <div className="space-y-1 text-xs font-mono text-stone-700 bg-white p-2.5 rounded border border-stone-200">
              <div className="flex items-center gap-2 truncate">
                <span className="text-stone-400 uppercase text-[10px] w-12 shrink-0">To:</span>
                <span className="font-semibold text-stone-900 truncate">
                  {currentEmail.recipientName} &lt;{currentEmail.recipientEmail}&gt;
                </span>
              </div>
              <div className="flex items-center gap-2 truncate">
                <span className="text-stone-400 uppercase text-[10px] w-12 shrink-0">From:</span>
                <span className="text-stone-800 truncate">
                  {currentEmail.senderName} &lt;{currentEmail.senderEmail}&gt;
                </span>
              </div>
              <div className="flex items-start gap-2 pt-1 border-t border-stone-100">
                <span className="text-stone-400 uppercase text-[10px] w-12 shrink-0 mt-0.5">Subject:</span>
                <span className="font-semibold text-[#003262] break-words">
                  {currentEmail.subject}
                </span>
              </div>
            </div>
          </div>

          {/* Email Body Content */}
          <div className="p-4 space-y-3 font-sans text-xs text-stone-800 leading-relaxed bg-white">
            <p className="font-medium text-stone-900">{currentEmail.salutation}</p>
            {currentEmail.bodyParagraphs.map((para, idx) => (
              <p key={idx} className="text-stone-800">
                {para}
              </p>
            ))}
            <div className="pt-2">
              <p className="text-stone-900 font-medium">{getCleanValediction()}</p>
              <p className="text-stone-900 font-bold">{currentEmail.senderName}</p>
              {currentEmail.postscript && (
                <p className="text-stone-500 text-[11px] mt-2 font-mono">
                  {currentEmail.postscript}
                </p>
              )}
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="p-3 bg-stone-50 border-t border-stone-200 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleCopyEmail}
              className="px-3 py-1.5 bg-white border border-stone-300 hover:border-[#003262] text-[#003262] rounded text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Email</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => onApplyDraftLetter(currentEmail)}
              className="px-3 py-1.5 bg-[#003262] hover:bg-[#002549] text-white rounded text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Apply to Editor Canvas</span>
            </button>

            <a
              href={getMailtoLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-white border border-stone-300 hover:border-stone-400 text-stone-700 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs ml-auto"
            >
              <ExternalLink className="w-3.5 h-3.5 text-stone-500" />
              <span>Open Mail App</span>
            </a>
          </div>

          {/* Policy Reference Citation */}
          {activeTurn?.policyReference && (
            <div className="mx-3.5 mb-3.5 p-2.5 bg-blue-50/70 rounded-lg border border-blue-200 text-[11px] text-blue-900 flex items-start gap-2">
              <School className="w-3.5 h-3.5 text-[#003262] shrink-0 mt-0.5" />
              <div>
                <strong className="block text-[#003262]">UC Berkeley Policy Compliance:</strong>
                <span>{activeTurn.policyReference}</span>
              </div>
            </div>
          )}

          {/* Compliance Checklist */}
          {activeTurn?.ruleChecks && (
            <div className="p-3 border-t border-stone-100 bg-stone-50/50">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-500 block mb-1.5">
                Email Quality Verification
              </span>
              <div className="grid grid-cols-2 gap-1 text-[11px]">
                <span className="flex items-center gap-1.5 text-emerald-700">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Casual studio tone</span>
                </span>
                <span className="flex items-center gap-1.5 text-emerald-700">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>First-name addressing (Hugh)</span>
                </span>
                <span className="flex items-center gap-1.5 text-emerald-700">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Deliverable handoff covered</span>
                </span>
                <span className="flex items-center gap-1.5 text-emerald-700">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Tang Center checkup noted</span>
                </span>
              </div>
            </div>
          )}

        </div>
      )}

      {/* History of Previous Generated Email Drafts */}
      {interactionHistory.length > 1 && (
        <div className="space-y-2 pt-2 border-t border-stone-200">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
              <History className="w-3.5 h-3.5" />
              <span>Generated Email Versions ({interactionHistory.length})</span>
            </span>
            {selectedHistoryIndex !== null && (
              <button
                type="button"
                onClick={() => setSelectedHistoryIndex(null)}
                className="text-[10px] text-[#003262] hover:underline font-semibold"
              >
                View Latest
              </button>
            )}
          </div>

          <div className="space-y-2">
            {interactionHistory.map((turn, i) => {
              const isSelected = selectedHistoryIndex === i || (selectedHistoryIndex === null && i === interactionHistory.length - 1);
              return (
                <div 
                  key={turn.id || i} 
                  onClick={() => setSelectedHistoryIndex(i)}
                  className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                    isSelected 
                      ? 'border-[#003262] bg-blue-50/40 ring-1 ring-[#003262]/20' 
                      : 'border-stone-200 bg-white hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] text-stone-400 font-mono mb-1">
                    <span className="font-semibold text-stone-700">Step {turn.step}: {turn.stepName}</span>
                    <span>{new Date(turn.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="font-semibold text-stone-900 truncate">
                    {turn.generatedEmail?.subject || 'Email Draft'}
                  </p>
                  <p className="text-stone-600 line-clamp-2 mt-0.5 text-[11px]">
                    {turn.generatedEmail?.bodyParagraphs?.[0]}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
