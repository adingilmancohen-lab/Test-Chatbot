import React, { useState } from 'react';
import { 
  Sparkles, 
  Wand2, 
  Check, 
  RotateCcw, 
  ArrowRight, 
  Send, 
  Sliders, 
  Scale,
  ShieldAlert,
  Flame,
  Heart,
  Scissors,
  Maximize2
} from 'lucide-react';
import { LetterData } from '../types';

interface RefinementPanelProps {
  currentLetter: LetterData;
  onRefine: (action: string, customInstruction?: string) => Promise<void>;
  isRefining: boolean;
  onUndo?: () => void;
  canUndo?: boolean;
  lastEditSummary?: string | null;
}

interface ActionPreset {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
}

const ACTION_PRESETS: ActionPreset[] = [
  {
    id: 'polish',
    label: 'Polish & Elevate',
    description: 'Refine vocabulary, flow, and cadence while keeping your original message.',
    icon: Wand2,
  },
  {
    id: 'more_formal',
    label: 'Make More Formal',
    description: 'Elevate register to ceremonial or strict executive standards.',
    icon: Scale,
  },
  {
    id: 'more_warm',
    label: 'Add Warmth & Empathy',
    description: 'Infuse sincere personal warmth, gratitude, and genuine human connection.',
    icon: Heart,
  },
  {
    id: 'more_assertive',
    label: 'Make Assertive & Firm',
    description: 'Eliminate passive phrasing; state boundaries and expectations decisively.',
    icon: Flame,
  },
  {
    id: 'more_concise',
    label: 'Shorten & Condense',
    description: 'Remove fluff and tighten sentences for rapid executive scanning.',
    icon: Scissors,
  },
  {
    id: 'expand',
    label: 'Expand Details & Context',
    description: 'Elaborate on supporting rationale and courteous transitional context.',
    icon: Maximize2,
  },
  {
    id: 'fix_grammar',
    label: 'Grammar & Syntax Fix',
    description: 'Punctuation, typo, and agreement correction without altering voice.',
    icon: Check,
  },
];

export const RefinementPanel: React.FC<RefinementPanelProps> = ({
  currentLetter,
  onRefine,
  isRefining,
  onUndo,
  canUndo,
  lastEditSummary,
}) => {
  const [customInstruction, setCustomInstruction] = useState('');
  const [activeAction, setActiveAction] = useState<string | null>(null);

  const handleActionClick = async (actionId: string) => {
    setActiveAction(actionId);
    try {
      await onRefine(actionId);
    } finally {
      setActiveAction(null);
    }
  };

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInstruction.trim()) return;
    setActiveAction('custom');
    try {
      await onRefine('custom', customInstruction);
      setCustomInstruction('');
    } finally {
      setActiveAction(null);
    }
  };

  return (
    <div className="p-4 sm:p-5 space-y-6">
      
      {/* Header with Undo */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-700">
            AI Refinement & Polishing
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Transform tone, rhythm, or register with a single click.
          </p>
        </div>

        {canUndo && (
          <button
            onClick={onUndo}
            className="flex items-center gap-1 text-xs text-stone-600 hover:text-stone-900 px-2 py-1 bg-stone-100 hover:bg-stone-200 rounded border border-stone-300 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Undo Edit</span>
          </button>
        )}
      </div>

      {/* Last Edit Feedback Banner */}
      {lastEditSummary && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-md p-3 text-xs text-emerald-900 flex items-start gap-2">
          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold">Recent Improvement: </span>
            {lastEditSummary}
          </div>
        </div>
      )}

      {/* Custom Instruction Prompt */}
      <form onSubmit={handleCustomSubmit} className="space-y-2">
        <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider">
          Direct Instruction
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={customInstruction}
            onChange={(e) => setCustomInstruction(e.target.value)}
            placeholder="e.g. Add a concluding sentence requesting a reply by Friday..."
            className="flex-1 text-xs bg-white border border-stone-300 rounded-md p-2.5 text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
          />
          <button
            type="submit"
            disabled={isRefining || !customInstruction.trim()}
            className="px-3.5 py-2 bg-stone-900 hover:bg-stone-800 disabled:bg-stone-300 text-stone-100 rounded-md text-xs font-medium flex items-center gap-1 transition-colors shrink-0 shadow-xs"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Apply</span>
          </button>
        </div>
      </form>

      {/* Quick Action Presets */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider">
          One-Click Transformations
        </label>

        <div className="space-y-1.5">
          {ACTION_PRESETS.map((preset) => {
            const Icon = preset.icon;
            const isLoading = isRefining && activeAction === preset.id;

            return (
              <button
                key={preset.id}
                onClick={() => handleActionClick(preset.id)}
                disabled={isRefining}
                className="w-full text-left p-3 rounded-lg border border-stone-200 bg-white hover:border-amber-400 hover:bg-amber-50/40 disabled:opacity-60 transition-all flex items-start justify-between group shadow-xs"
              >
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-md bg-stone-100 group-hover:bg-amber-100 text-stone-700 group-hover:text-amber-900 transition-colors shrink-0 mt-0.5">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-stone-900 group-hover:text-amber-950">
                      {preset.label}
                    </div>
                    <div className="text-[11px] text-stone-500 leading-normal mt-0.5">
                      {preset.description}
                    </div>
                  </div>
                </div>

                <div className="shrink-0 text-stone-400 group-hover:text-amber-600 transition-colors pt-1">
                  {isLoading ? (
                    <Sparkles className="w-4 h-4 animate-spin text-amber-600" />
                  ) : (
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
