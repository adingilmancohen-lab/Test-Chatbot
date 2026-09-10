import React, { useState } from 'react';
import { X, FileText, ArrowRight, Check, Sparkles } from 'lucide-react';
import { LetterTemplate, LetterCategory } from '../types';
import { LETTER_TEMPLATES } from '../data/templates';

interface TemplatePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: LetterTemplate) => void;
}

export const TemplatePickerModal: React.FC<TemplatePickerModalProps> = ({
  isOpen,
  onClose,
  onSelectTemplate,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [previewTemplate, setPreviewTemplate] = useState<LetterTemplate>(LETTER_TEMPLATES[0]);

  if (!isOpen) return null;

  const categories = ['all', 'business', 'formal', 'personal', 'official', 'recommendation'];

  const filtered = selectedCategory === 'all'
    ? LETTER_TEMPLATES
    : LETTER_TEMPLATES.filter((t) => t.category === selectedCategory);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs no-print">
      <div className="bg-white rounded-xl shadow-2xl border border-stone-200 w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div>
            <h2 className="text-base font-semibold text-stone-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-600" />
              <span>Curated Letter Templates</span>
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Choose a starter framework; Gemini will adapt it with your specifics.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-700 rounded-md hover:bg-stone-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Pills */}
        <div className="px-5 py-2.5 border-b border-stone-100 flex items-center gap-1.5 overflow-x-auto bg-stone-50/50">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 text-xs rounded-full capitalize font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-stone-900 text-stone-100'
                  : 'bg-white text-stone-600 hover:bg-stone-200 border border-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Content Body: Two Columns */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-stone-200">
          
          {/* Template List */}
          <div className="overflow-y-auto p-4 space-y-2 max-h-[450px]">
            {filtered.map((tpl) => (
              <div
                key={tpl.id}
                onClick={() => setPreviewTemplate(tpl)}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  previewTemplate.id === tpl.id
                    ? 'border-amber-600 bg-amber-50/60 ring-1 ring-amber-500 shadow-xs'
                    : 'border-stone-200 bg-white hover:border-stone-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-stone-900">{tpl.name}</span>
                  <span className="text-[10px] font-mono uppercase bg-stone-100 px-1.5 py-0.5 rounded text-stone-600">
                    {tpl.category}
                  </span>
                </div>
                <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                  {tpl.description}
                </p>
              </div>
            ))}
          </div>

          {/* Template Preview Column */}
          <div className="p-5 flex flex-col justify-between overflow-y-auto bg-stone-50/30">
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-semibold text-amber-700 uppercase tracking-widest block font-cinzel">
                  Template Blueprint
                </span>
                <h3 className="text-base font-semibold text-stone-900 mt-1">
                  {previewTemplate.name}
                </h3>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                  {previewTemplate.description}
                </p>
              </div>

              <div className="bg-white p-3.5 rounded-lg border border-stone-200 space-y-2 text-xs">
                <div>
                  <span className="text-stone-500 block text-[11px] font-medium">Primary Intent:</span>
                  <span className="text-stone-800">{previewTemplate.purpose}</span>
                </div>
                <div>
                  <span className="text-stone-500 block text-[11px] font-medium">Sample Key Context:</span>
                  <span className="text-stone-800 font-mono text-[11px]">{previewTemplate.keyPoints}</span>
                </div>
                <div>
                  <span className="text-stone-500 block text-[11px] font-medium">Preview Excerpt:</span>
                  <p className="text-stone-700 italic border-l-2 border-amber-400 pl-2.5 my-1">
                    "{previewTemplate.previewSnippet}"
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-200 mt-4 flex items-center justify-end gap-2">
              <button
                onClick={onClose}
                className="px-3.5 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 rounded-md hover:bg-stone-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onSelectTemplate(previewTemplate);
                  onClose();
                }}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-stone-950 font-semibold rounded-md text-xs flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Load Template Into Editor</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
