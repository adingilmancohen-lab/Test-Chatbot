import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  ChevronDown, 
  ChevronUp, 
  Info, 
  Wand2, 
  CheckCircle2, 
  Lightbulb,
  Sliders
} from 'lucide-react';
import { LetterCategory, LetterTone, LetterLength, LetterData } from '../types';

interface DraftingPanelProps {
  currentLetter: LetterData;
  onGenerateDraft: (params: {
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
  }) => Promise<void>;
  isGenerating: boolean;
  error: string | null;
}

const TONES: { value: LetterTone; label: string; desc: string }[] = [
  { value: 'professional', label: 'Professional', desc: 'Poised, clear, business-standard' },
  { value: 'warm', label: 'Warm & Cordial', desc: 'Heartfelt, empathic, approachable' },
  { value: 'assertive', label: 'Assertive & Firm', desc: 'Decisive, direct, unwavering' },
  { value: 'diplomatic', label: 'Diplomatic', desc: 'Tactful, measured, balanced' },
  { value: 'persuasive', label: 'Persuasive', desc: 'Compelling, inspiring, conviction-led' },
  { value: 'apologetic', label: 'Apologetic', desc: 'Humble, accountable, solution-minded' },
  { value: 'formal', label: 'Strictly Formal', desc: 'Ceremonial, traditional, elevated' },
];

const CATEGORIES: { value: LetterCategory; label: string }[] = [
  { value: 'business', label: 'Business' },
  { value: 'formal', label: 'Formal' },
  { value: 'personal', label: 'Personal' },
  { value: 'official', label: 'Official / Legal' },
  { value: 'recommendation', label: 'Recommendation' },
  { value: 'inquiry', label: 'Inquiry' },
];

const QUICK_PROMPTS = [
  { label: 'Hugh Dubberly: Absence (Sickness)', purpose: 'Notify Professor Hugh Dubberly of class absence in DES INV 200 due to serious sickness and Tang Center visit, outlining partner critique plan.', tone: 'professional' as LetterTone },
  { label: 'Studio Critique Reschedule', purpose: 'Request alternative asynchronous critique or rescheduled review for MDes studio project due to acute sickness.', tone: 'diplomatic' as LetterTone },
  { label: 'Tang Center Medical Excusal', purpose: 'Formal notification backed by University Health Services verification for multi-day course absence.', tone: 'formal' as LetterTone },
  { label: 'Job Application', purpose: 'Cover letter applying for a leadership role connecting my background to company goals.', tone: 'persuasive' as LetterTone },
  { label: 'Mentor Thank You', purpose: 'Expressing heartfelt appreciation to a mentor who helped me grow.', tone: 'warm' as LetterTone },
  { label: 'Resignation Notice', purpose: 'Formal resignation giving two weeks notice with gratitude for growth.', tone: 'formal' as LetterTone },
];

export const DraftingPanel: React.FC<DraftingPanelProps> = ({
  currentLetter,
  onGenerateDraft,
  isGenerating,
  error,
}) => {
  const [purpose, setPurpose] = useState('');
  const [keyPoints, setKeyPoints] = useState('');
  const [category, setCategory] = useState<LetterCategory>(currentLetter.category || 'business');
  const [tone, setTone] = useState<LetterTone>(currentLetter.tone || 'professional');
  const [length, setLength] = useState<LetterLength>('balanced');
  const [showParties, setShowParties] = useState(false);

  // Local sender/recipient overrides for quick prompt entry
  const [senderName, setSenderName] = useState(currentLetter.sender.name);
  const [senderTitle, setSenderTitle] = useState(currentLetter.sender.title);
  const [senderOrg, setSenderOrg] = useState(currentLetter.sender.organization);
  const [recipientName, setRecipientName] = useState(currentLetter.recipient.name);
  const [recipientTitle, setRecipientTitle] = useState(currentLetter.recipient.title);
  const [recipientOrg, setRecipientOrg] = useState(currentLetter.recipient.organization);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!purpose.trim()) return;

    await onGenerateDraft({
      purpose,
      keyPoints,
      category,
      tone,
      length,
      senderName,
      senderTitle,
      senderOrg,
      recipientName,
      recipientTitle,
      recipientOrg,
    });
  };

  const applyQuickPrompt = (qp: typeof QUICK_PROMPTS[0]) => {
    setPurpose(qp.purpose);
    setTone(qp.tone);
  };

  return (
    <div className="p-4 sm:p-5 space-y-6">
      {/* Introduction banner */}
      <div className="bg-stone-50 border border-stone-200 rounded-lg p-3 text-xs text-stone-600 flex items-start gap-2">
        <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-stone-800">Epistolary AI Engine: </span>
          Describe your objective or paste your bullet points. Gemini will structure a complete, beautifully proportioned letter ready to sign.
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3 rounded-md">
          {error}
        </div>
      )}

      {/* Quick Starter Chips */}
      <div>
        <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
          Quick Inspirations
        </label>
        <div className="flex flex-wrap gap-1.5">
          {QUICK_PROMPTS.map((qp, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => applyQuickPrompt(qp)}
              className="px-2.5 py-1 text-xs bg-white hover:bg-amber-50 hover:text-amber-900 border border-stone-200 hover:border-amber-300 rounded-full text-stone-600 transition-colors"
            >
              {qp.label}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Purpose */}
        <div>
          <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
            Purpose of the Letter <span className="text-amber-600">*</span>
          </label>
          <textarea
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            placeholder="e.g. Formally notify my employer of my resignation, thanking them for the 3 years of growth and offering a smooth handover..."
            rows={3}
            required
            className="w-full text-sm bg-white border border-stone-300 rounded-md p-2.5 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
          />
        </div>

        {/* Key Points */}
        <div>
          <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
            Key Points & Details <span className="text-stone-400 font-normal">(Optional)</span>
          </label>
          <textarea
            value={keyPoints}
            onChange={(e) => setKeyPoints(e.target.value)}
            placeholder="• Final date: October 31&#10;• Will document current sprint processes&#10;• Recommend Sarah as interim lead"
            rows={3}
            className="w-full text-sm bg-white border border-stone-300 rounded-md p-2.5 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 font-mono text-xs"
          />
        </div>

        {/* Category and Length Row */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as LetterCategory)}
              className="w-full text-xs bg-white border border-stone-300 rounded-md p-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Length
            </label>
            <div className="grid grid-cols-3 gap-1 bg-stone-100 p-0.5 rounded-md border border-stone-200">
              {(['concise', 'balanced', 'comprehensive'] as LetterLength[]).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLength(l)}
                  className={`py-1 text-[11px] font-medium capitalize rounded transition-colors ${
                    length === l
                      ? 'bg-white text-stone-900 shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {l === 'concise' ? 'Brief' : l === 'balanced' ? 'Standard' : 'Full'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tone Selector */}
        <div>
          <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
            Voice & Tone
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {TONES.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setTone(t.value)}
                className={`text-left p-2 rounded-md border text-xs transition-all ${
                  tone === t.value
                    ? 'border-amber-600 bg-amber-50 text-amber-950 font-medium shadow-xs'
                    : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
                }`}
              >
                <div className="font-medium text-stone-900">{t.label}</div>
                <div className="text-[10px] text-stone-500 truncate">{t.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Collapsible Sender & Recipient Overrides */}
        <div className="border border-stone-200 rounded-md bg-stone-50 overflow-hidden">
          <button
            type="button"
            onClick={() => setShowParties(!showParties)}
            className="w-full px-3 py-2 text-xs font-semibold text-stone-700 flex items-center justify-between hover:bg-stone-100 transition-colors"
          >
            <span>Sender & Recipient Metadata</span>
            {showParties ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showParties && (
            <div className="p-3 bg-white border-t border-stone-200 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] text-stone-600 mb-0.5">Your Name</label>
                  <input
                    type="text"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="Sender Name"
                    className="w-full p-1.5 border border-stone-200 rounded text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-stone-600 mb-0.5">Your Title/Org</label>
                  <input
                    type="text"
                    value={senderTitle}
                    onChange={(e) => setSenderTitle(e.target.value)}
                    placeholder="Title or Organization"
                    className="w-full p-1.5 border border-stone-200 rounded text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] text-stone-600 mb-0.5">Recipient Name</label>
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="Recipient Name"
                    className="w-full p-1.5 border border-stone-200 rounded text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-stone-600 mb-0.5">Recipient Title/Org</label>
                  <input
                    type="text"
                    value={recipientTitle}
                    onChange={(e) => setRecipientTitle(e.target.value)}
                    placeholder="Title or Organization"
                    className="w-full p-1.5 border border-stone-200 rounded text-xs"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isGenerating || !purpose.trim()}
          className="w-full py-2.5 px-4 bg-amber-600 hover:bg-amber-500 disabled:bg-stone-300 text-stone-950 font-semibold rounded-md shadow-sm transition-all flex items-center justify-center gap-2 text-sm"
        >
          {isGenerating ? (
            <>
              <Sparkles className="w-4 h-4 animate-spin text-stone-900" />
              <span>Crafting Letter with Gemini...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Draft Letter with AI</span>
            </>
          )}
        </button>
      </form>

      {/* Post-generation assessment and tips */}
      {currentLetter.toneAssessment && (
        <div className="bg-amber-50/70 border border-amber-200/80 rounded-lg p-3 space-y-2 text-xs">
          <div className="flex items-center gap-1.5 font-semibold text-amber-900">
            <CheckCircle2 className="w-4 h-4 text-amber-700" />
            <span>Voice & Tone Assessment</span>
          </div>
          <p className="text-stone-700 leading-relaxed italic">
            "{currentLetter.toneAssessment}"
          </p>

          {currentLetter.writingTips && currentLetter.writingTips.length > 0 && (
            <div className="pt-2 border-t border-amber-200/60">
              <span className="font-medium text-amber-950 block mb-1">Editor’s Checklist:</span>
              <ul className="list-disc list-inside space-y-0.5 text-stone-600">
                {currentLetter.writingTips.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
