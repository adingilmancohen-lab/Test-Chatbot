import React, { useState } from 'react';
import { Sparkles, MessageSquareQuote, Check } from 'lucide-react';

interface RevisionCardProps {
  onRevise: (feedback: string) => Promise<void>;
  isRevising: boolean;
  disabled?: boolean;
}

const QUICK_FEEDBACK_OPTIONS = [
  "Make it more concise (under 3 sentences)",
  "Emphasize that our Figma link is updated",
  "Add that I'm also notifying my project partner",
  "Make the tone slightly warmer and friendlier",
  "Ask if we can reschedule to tomorrow's office hours",
];

export const RevisionCard: React.FC<RevisionCardProps> = ({
  onRevise,
  isRevising,
  disabled = false,
}) => {
  const [feedback, setFeedback] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim() || isRevising || disabled) return;
    await onRevise(feedback);
    setFeedback('');
  };

  const handleSelectQuickFeedback = (text: string) => {
    setFeedback(text);
  };

  return (
    <div className="bg-stone-50 rounded-lg border border-stone-200 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <label 
          htmlFor="email-revision-input"
          className="text-xs font-bold text-stone-800 flex items-center gap-1.5"
        >
          <MessageSquareQuote className="w-4 h-4 text-[#003262]" />
          <span>Revise Email with Feedback</span>
        </label>
        <span className="text-[10px] text-stone-500 font-mono">
          Iterate & refine
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-2.5">
        <div className="flex gap-2">
          <input
            id="email-revision-input"
            type="text"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            disabled={disabled || isRevising}
            placeholder="e.g. Make it shorter, add that my laptop died, or mention office hours..."
            className="flex-1 px-3 py-2 text-xs text-stone-800 bg-white border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#003262]/20 focus:border-[#003262] placeholder:text-stone-400 transition-all"
          />
          <button
            id="submit-revision-btn"
            type="submit"
            disabled={!feedback.trim() || isRevising || disabled}
            className={`px-3.5 py-2 text-xs font-semibold rounded-md flex items-center gap-1.5 transition-all shadow-2xs shrink-0 ${
              !feedback.trim() || isRevising || disabled
                ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                : 'bg-[#003262] hover:bg-[#002549] text-white active:scale-95'
            }`}
          >
            {isRevising ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Revising...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-[#FDB515]" />
                <span>Apply Feedback</span>
              </>
            )}
          </button>
        </div>

        {/* Quick Feedback Chips */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          <span className="text-[10px] text-stone-400 font-medium self-center mr-1">Quick feedback:</span>
          {QUICK_FEEDBACK_OPTIONS.map((opt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectQuickFeedback(opt)}
              disabled={isRevising || disabled}
              className="text-[10px] bg-white hover:bg-stone-100 text-stone-600 hover:text-stone-900 border border-stone-200 rounded px-2 py-0.5 transition-colors"
            >
              {opt}
            </button>
          ))}
        </div>
      </form>
    </div>
  );
};
