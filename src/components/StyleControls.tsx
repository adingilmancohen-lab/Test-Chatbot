import React from 'react';
import { 
  Palette, 
  Type as TypeIcon, 
  Eye, 
  Check, 
  Sliders,
  FileCheck
} from 'lucide-react';
import { LetterData, LetterheadStyle, LetterFont } from '../types';

interface StyleControlsProps {
  currentLetter: LetterData;
  onChangeStyle: (updatedStyle: LetterData['style']) => void;
}

const STATIONERY_STYLES: { id: LetterheadStyle; name: string; desc: string; previewClass: string }[] = [
  {
    id: 'classic',
    name: 'Classic Stationery',
    desc: 'Timeless warm cream stock with traditional monogram crest.',
    previewClass: 'bg-[#fdfcf9] border-stone-300',
  },
  {
    id: 'executive',
    name: 'Executive Slate',
    desc: 'Crisp white paper with a bold navy/slate header bar.',
    previewClass: 'bg-white border-slate-900 border-t-4',
  },
  {
    id: 'linen',
    name: 'Warm Linen',
    desc: 'Rich antique tint with delicate deckled-edge styling.',
    previewClass: 'bg-[#faf6ee] border-amber-800/30',
  },
  {
    id: 'minimal',
    name: 'Minimal Clean',
    desc: 'Pure crisp white with generous negative space.',
    previewClass: 'bg-white border-neutral-200',
  },
];

const FONTS: { id: LetterFont; name: string; fontClass: string; example: string }[] = [
  { id: 'garamond', name: 'EB Garamond', fontClass: 'font-garamond', example: 'Traditional, scholarly, and elegant' },
  { id: 'newsreader', name: 'Newsreader', fontClass: 'font-newsreader', example: 'Refined editorial letterpress' },
  { id: 'lora', name: 'Lora Serif', fontClass: 'font-lora', example: 'Warm, contemporary, and balanced' },
  { id: 'inter', name: 'Clean Sans', fontClass: 'font-sans', example: 'Direct, neutral, modern business' },
];

export const StyleControls: React.FC<StyleControlsProps> = ({
  currentLetter,
  onChangeStyle,
}) => {
  const { style } = currentLetter;

  const update = (partial: Partial<typeof style>) => {
    onChangeStyle({ ...style, ...partial });
  };

  return (
    <div className="p-4 sm:p-5 space-y-6">
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-700">
          Stationery & Typography
        </h3>
        <p className="text-xs text-stone-500 mt-0.5">
          Select your paper theme, typography, and header visibility for physical print or PDF.
        </p>
      </div>

      {/* Stationery Styles */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider">
          Paper & Letterhead Style
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {STATIONERY_STYLES.map((st) => (
            <button
              key={st.id}
              onClick={() => update({ letterhead: st.id })}
              className={`p-3 rounded-lg border text-left transition-all ${
                style.letterhead === st.id
                  ? 'border-amber-600 bg-amber-50/50 shadow-xs ring-1 ring-amber-500'
                  : 'border-stone-200 bg-white hover:border-stone-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className={`w-8 h-5 rounded border ${st.previewClass} shadow-2xs`} />
                {style.letterhead === st.id && (
                  <Check className="w-3.5 h-3.5 text-amber-600" />
                )}
              </div>
              <div className="text-xs font-semibold text-stone-900">{st.name}</div>
              <div className="text-[10px] text-stone-500 mt-0.5 leading-normal">{st.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Font Family */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider">
          Typographic Voice
        </label>
        <div className="space-y-1.5">
          {FONTS.map((f) => (
            <button
              key={f.id}
              onClick={() => update({ font: f.id })}
              className={`w-full p-2.5 rounded-md border text-left transition-all flex items-center justify-between ${
                style.font === f.id
                  ? 'border-amber-600 bg-amber-50/40 font-medium'
                  : 'border-stone-200 bg-white hover:border-stone-300'
              }`}
            >
              <div>
                <span className={`text-sm text-stone-900 ${f.fontClass}`}>
                  {f.name}
                </span>
                <span className="text-[11px] text-stone-400 block">
                  {f.example}
                </span>
              </div>
              {style.font === f.id && (
                <Check className="w-4 h-4 text-amber-600 shrink-0" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Structural Elements Toggles */}
      <div className="space-y-2 pt-2 border-t border-stone-200">
        <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider">
          Letter Structure Elements
        </label>

        <div className="bg-white border border-stone-200 rounded-lg divide-y divide-stone-100 text-xs">
          <label className="flex items-center justify-between p-3 cursor-pointer hover:bg-stone-50">
            <div>
              <span className="font-medium text-stone-900 block">Sender Letterhead Header</span>
              <span className="text-stone-500 text-[11px]">Show organization / name at top of sheet</span>
            </div>
            <input
              type="checkbox"
              checked={style.showHeader}
              onChange={(e) => update({ showHeader: e.target.checked })}
              className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
            />
          </label>

          <label className="flex items-center justify-between p-3 cursor-pointer hover:bg-stone-50">
            <div>
              <span className="font-medium text-stone-900 block">Date Header</span>
              <span className="text-stone-500 text-[11px]">Include formalized date above salutation</span>
            </div>
            <input
              type="checkbox"
              checked={style.showDate}
              onChange={(e) => update({ showDate: e.target.checked })}
              className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
            />
          </label>

          <label className="flex items-center justify-between p-3 cursor-pointer hover:bg-stone-50">
            <div>
              <span className="font-medium text-stone-900 block">Subject Line (RE:)</span>
              <span className="text-stone-500 text-[11px]">Include formal reference/subject before greeting</span>
            </div>
            <input
              type="checkbox"
              checked={style.showSubject}
              onChange={(e) => update({ showSubject: e.target.checked })}
              className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
            />
          </label>
        </div>
      </div>
    </div>
  );
};
