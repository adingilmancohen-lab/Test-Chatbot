import React, { useState } from 'react';
import { X, Sparkles, CornerUpLeft, ArrowRight, MessageSquare, Check } from 'lucide-react';
import { LetterTone } from '../types';

interface ReplyAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyReply: (replyData: {
    subject: string;
    salutation: string;
    bodyParagraphs: string[];
    valediction: string;
    postscript?: string;
  }) => void;
}

const RESPONSE_GOALS = [
  { label: 'Accept Graciously', goal: 'Accept the offer or proposal graciously and state immediate next steps.' },
  { label: 'Politely Decline', goal: 'Decline respectfully with sincere gratitude, maintaining a strong positive relationship.' },
  { label: 'Counter-Offer / Negotiate', goal: 'Express enthusiasm for the premise while proposing specific revised terms or pricing.' },
  { label: 'Request Clarification', goal: 'Acknowledge the letter and ask targeted clarifying questions before committing.' },
  { label: 'Acknowledge & Buy Time', goal: 'Formal acknowledgment of receipt, noting the matter is currently under review.' },
];

export const ReplyAssistantModal: React.FC<ReplyAssistantModalProps> = ({
  isOpen,
  onClose,
  onApplyReply,
}) => {
  const [receivedText, setReceivedText] = useState('');
  const [responseGoal, setResponseGoal] = useState(RESPONSE_GOALS[0].goal);
  const [tone, setTone] = useState<LetterTone>('diplomatic');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!receivedText.trim() || !responseGoal.trim()) return;

    setIsGenerating(true);
    setError(null);

    try {
      const res = await fetch('/api/letter/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receivedLetterText: receivedText,
          responseGoal,
          tone,
        }),
      });

      if (!res.ok) {
        let errorMsg = 'Failed to generate reply';
        try {
          const data = await res.json();
          if (data?.error) errorMsg = data.error;
        } catch {
          errorMsg = `Failed to generate reply (HTTP ${res.status}: ${res.statusText || 'Server Error'})`;
        }
        throw new Error(errorMsg);
      }

      const data = await res.json();
      onApplyReply(data);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error creating reply');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs no-print">
      <div className="bg-white rounded-xl shadow-2xl border border-stone-200 w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div>
            <h2 className="text-base font-semibold text-stone-900 flex items-center gap-2">
              <CornerUpLeft className="w-5 h-5 text-amber-600" />
              <span>Reply Assistant</span>
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Paste the letter or message you received, and Gemini will compose an astute response.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-700 rounded-md hover:bg-stone-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleGenerate} className="flex-1 overflow-y-auto p-5 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-md">
              {error}
            </div>
          )}

          {/* Paste incoming letter */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Received Letter / Message Text <span className="text-amber-600">*</span>
            </label>
            <textarea
              value={receivedText}
              onChange={(e) => setReceivedText(e.target.value)}
              placeholder="Paste the message or letter you received here..."
              rows={5}
              required
              className="w-full text-xs font-mono bg-stone-50 border border-stone-300 rounded-md p-2.5 text-stone-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {/* Quick Goals */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
              Your Response Objective
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {RESPONSE_GOALS.map((g, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setResponseGoal(g.goal)}
                  className={`px-2.5 py-1 text-xs rounded-full border transition-all ${
                    responseGoal === g.goal
                      ? 'bg-amber-600 text-stone-950 font-semibold border-amber-600'
                      : 'bg-white text-stone-600 hover:bg-stone-100 border-stone-200'
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>

            <textarea
              value={responseGoal}
              onChange={(e) => setResponseGoal(e.target.value)}
              rows={2}
              placeholder="Describe what your response should achieve..."
              className="w-full text-xs bg-white border border-stone-300 rounded-md p-2.5 text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {/* Tone */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Response Tone
            </label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value as LetterTone)}
              className="w-full text-xs bg-white border border-stone-300 rounded-md p-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="diplomatic">Diplomatic (Tactful & balanced)</option>
              <option value="professional">Professional (Standard executive)</option>
              <option value="warm">Warm & Grateful</option>
              <option value="assertive">Assertive & Firm</option>
              <option value="formal">Strictly Formal</option>
            </select>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isGenerating || !receivedText.trim()}
              className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 disabled:bg-stone-300 text-stone-950 font-semibold text-xs rounded-md shadow-sm transition-all flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-stone-950" />
                  <span>Drafting Strategic Reply...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Reply Draft</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
