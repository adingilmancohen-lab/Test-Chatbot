import React, { useState } from 'react';
import { Sparkles, MessageSquareQuote } from 'lucide-react';
import { BoschCreature, BoschStrawberry } from './BoschIcons';

interface RevisionCardProps {
  onRevise: (feedback: string) => Promise<void>;
  isRevising: boolean;
  disabled?: boolean;
}

const QUICK_FEEDBACK_OPTIONS = [
  "Shorten into a terse studio missive (under 3 sentences)",
  "Emphasize Figma progress & Jacobs Hall pinning up",
  "Highlight sick tang center visit without oversharing",
  "Warm collegiate tone for studio professor",
  "Ask for 24-hr extension while keeping partner updated",
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
    <div className="bg-[#242118] rounded-lg border-2 border-[#5a482e] p-4 space-y-3 shadow-lg relative overflow-hidden">
      {/* Subtle organic garden watermark */}
      <div className="absolute -right-3 -bottom-3 opacity-15 pointer-events-none text-[#d4af37]">
        <BoschCreature className="w-20 h-20" />
      </div>

      <div className="flex items-center justify-between">
        <label 
          htmlFor="email-revision-input"
          className="text-xs font-bold text-[#f5d77f] flex items-center gap-1.5 font-almendra tracking-wider"
        >
          <BoschCreature className="w-4 h-4 text-[#e06b75]" />
          <span>Revise Epistolary Draft with Guidance</span>
        </label>
        <span className="text-[10px] text-[#9a8c72] font-medieval flex items-center gap-1">
          <BoschStrawberry className="w-3 h-3 text-[#c13e48]" />
          Transmute Draft
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-2.5 relative z-10">
        <div className="flex gap-2">
          <input
            id="email-revision-input"
            type="text"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            disabled={disabled || isRevising}
            placeholder="e.g. Make it more concise, emphasize our Figma link, or mention office hours..."
            className="flex-1 px-3 py-2 text-xs text-[#2c2214] bg-[#fbf5e8] border-2 border-[#8c6b38] rounded-md focus:outline-none focus:ring-2 focus:ring-[#d4af37]/50 focus:border-[#d4af37] placeholder:text-stone-400 font-serif transition-all"
          />
          <button
            id="submit-revision-btn"
            type="submit"
            disabled={!feedback.trim() || isRevising || disabled}
            className={`px-4 py-2 text-xs font-semibold rounded-md flex items-center gap-1.5 transition-all shadow-md shrink-0 font-medieval tracking-wide ${
              !feedback.trim() || isRevising || disabled
                ? 'bg-[#3d3627] text-stone-500 cursor-not-allowed border border-[#524734]'
                : 'bg-gradient-to-b from-[#e06b75] to-[#a33845] hover:from-[#eb7d86] hover:to-[#b84351] text-white border border-[#f4a5ae] active:scale-95'
            }`}
          >
            {isRevising ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Transmuting...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-[#f4d35e]" />
                <span>Apply Guidance</span>
              </>
            )}
          </button>
        </div>

        {/* Quick Feedback Chips styled like medieval marginalia */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          <span className="text-[10px] text-[#a49171] font-medieval self-center mr-1">Marginalia:</span>
          {QUICK_FEEDBACK_OPTIONS.map((opt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectQuickFeedback(opt)}
              disabled={isRevising || disabled}
              className="text-[10px] bg-[#1a1c14] hover:bg-[#2d291e] text-[#d6c7a7] hover:text-[#f5d77f] border border-[#52442e] hover:border-[#d4af37] rounded px-2.5 py-1 transition-colors font-serif italic"
            >
              {opt}
            </button>
          ))}
        </div>
      </form>
    </div>
  );
};
