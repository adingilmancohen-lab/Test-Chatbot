import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  ThumbsUp, 
  AlertCircle, 
  CheckCircle, 
  Award,
  RefreshCw
} from 'lucide-react';
import { LetterData, CritiqueResult } from '../types';

interface CritiquePanelProps {
  currentLetter: LetterData;
  onRunCritique: (audience: string) => Promise<CritiqueResult | null>;
  critiqueResult: CritiqueResult | null;
  isAnalyzing: boolean;
}

export const CritiquePanel: React.FC<CritiquePanelProps> = ({
  currentLetter,
  onRunCritique,
  critiqueResult,
  isAnalyzing,
}) => {
  const [audience, setAudience] = useState('Senior executive or prospective partner');

  const handleAnalyze = async () => {
    await onRunCritique(audience);
  };

  return (
    <div className="p-4 sm:p-5 space-y-6">
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-700">
          Etiquette & Tone Audit
        </h3>
        <p className="text-xs text-stone-500 mt-0.5">
          Have an AI communications specialist critique your letter before sending.
        </p>
      </div>

      {/* Target Audience Input */}
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider">
          Intended Recipient / Context
        </label>
        <input
          type="text"
          value={audience}
          onChange={(e) => setAudience(e.target.value)}
          placeholder="e.g. Board of Directors, prospective client, landlord..."
          className="w-full text-xs bg-white border border-stone-300 rounded-md p-2.5 text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
        />
      </div>

      {/* Trigger Button */}
      <button
        onClick={handleAnalyze}
        disabled={isAnalyzing}
        className="w-full py-2.5 px-4 bg-stone-900 hover:bg-stone-800 disabled:bg-stone-300 text-stone-100 text-xs font-semibold rounded-md shadow-sm transition-all flex items-center justify-center gap-2"
      >
        {isAnalyzing ? (
          <>
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
            <span>Analyzing Correspondence...</span>
          </>
        ) : (
          <>
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Run Etiquette & Clarity Audit</span>
          </>
        )}
      </button>

      {/* Analysis Results Display */}
      {critiqueResult && (
        <div className="space-y-4 pt-2">
          {/* Scores Meter */}
          <div className="grid grid-cols-2 gap-3 bg-stone-50 p-3.5 rounded-lg border border-stone-200">
            <div>
              <div className="text-[11px] text-stone-500 uppercase tracking-wider font-semibold">
                Etiquette & Tact
              </div>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-bold text-stone-900 font-mono">
                  {critiqueResult.politenessScore}
                </span>
                <span className="text-xs text-stone-400 font-mono">/100</span>
              </div>
              <div className="w-full bg-stone-200 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${critiqueResult.politenessScore}%` }}
                />
              </div>
            </div>

            <div>
              <div className="text-[11px] text-stone-500 uppercase tracking-wider font-semibold">
                Clarity & Directness
              </div>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-bold text-stone-900 font-mono">
                  {critiqueResult.clarityScore}
                </span>
                <span className="text-xs text-stone-400 font-mono">/100</span>
              </div>
              <div className="w-full bg-stone-200 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-amber-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${critiqueResult.clarityScore}%` }}
                />
              </div>
            </div>
          </div>

          {/* Tone Perception */}
          <div className="bg-white border border-stone-200 p-3 rounded-md text-xs space-y-1">
            <span className="font-semibold text-stone-800 uppercase tracking-wider text-[10px] block">
              Recipient Perception
            </span>
            <p className="text-stone-700 leading-relaxed italic">
              "{critiqueResult.toneImpression}"
            </p>
          </div>

          {/* Strengths */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-emerald-800 flex items-center gap-1.5">
              <ThumbsUp className="w-3.5 h-3.5 text-emerald-600" />
              <span>Key Strengths</span>
            </span>
            <ul className="space-y-1 text-xs text-stone-600 pl-1">
              {critiqueResult.strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Opportunities for Improvement */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-amber-900 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
              <span>Suggested Refinements</span>
            </span>
            <ul className="space-y-1 text-xs text-stone-600 pl-1">
              {critiqueResult.improvements.map((imp, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>{imp}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Final Verdict */}
          <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-md text-xs text-amber-950">
            <span className="font-semibold block mb-0.5">Summary Verdict:</span>
            <p className="text-stone-700">{critiqueResult.verdict}</p>
          </div>
        </div>
      )}
    </div>
  );
};
