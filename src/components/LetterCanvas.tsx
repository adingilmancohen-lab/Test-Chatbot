import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Sparkles, 
  Check, 
  Edit3, 
  Eye, 
  Layers,
  Building,
  User,
  Calendar,
  ShieldCheck
} from 'lucide-react';
import { LetterData, LetterheadStyle, LetterFont } from '../types';
import { calculateLetterStats } from '../utils/formatters';

interface LetterCanvasProps {
  letter: LetterData;
  onChange: (updated: LetterData) => void;
  onRephraseParagraph: (index: number, text: string) => void;
  rephrasingIndex: number | null;
}

export const LetterCanvas: React.FC<LetterCanvasProps> = ({
  letter,
  onChange,
  onRephraseParagraph,
  rephrasingIndex,
}) => {
  const [isEditMode, setIsEditMode] = useState<boolean>(true);
  const [activeParagraphIndex, setActiveParagraphIndex] = useState<number | null>(null);

  const stats = calculateLetterStats(letter);

  // Font family resolver
  const getFontClass = (font: LetterFont) => {
    switch (font) {
      case 'garamond':
        return 'font-garamond';
      case 'newsreader':
        return 'font-newsreader';
      case 'lora':
        return 'font-lora';
      case 'inter':
      default:
        return 'font-sans';
    }
  };

  // Paper styling
  const getPaperStyles = (style: LetterheadStyle) => {
    switch (style) {
      case 'linen':
        return 'bg-[#faf6ee] text-stone-900 border-amber-900/10 shadow-lg';
      case 'executive':
        return 'bg-white text-slate-900 border-slate-200 shadow-xl';
      case 'minimal':
        return 'bg-white text-neutral-900 border-neutral-100 shadow-md';
      case 'classic':
      default:
        return 'bg-[#fdfcf9] text-stone-900 border-stone-200 shadow-lg';
    }
  };

  const updateField = <K extends keyof LetterData>(key: K, value: LetterData[K]) => {
    onChange({
      ...letter,
      [key]: value,
      updatedAt: new Date().toISOString(),
    });
  };

  const updateSender = (field: keyof typeof letter.sender, val: string) => {
    onChange({
      ...letter,
      sender: { ...letter.sender, [field]: val },
      updatedAt: new Date().toISOString(),
    });
  };

  const updateRecipient = (field: keyof typeof letter.recipient, val: string) => {
    onChange({
      ...letter,
      recipient: { ...letter.recipient, [field]: val },
      updatedAt: new Date().toISOString(),
    });
  };

  const handleParagraphChange = (index: number, val: string) => {
    const updated = [...letter.bodyParagraphs];
    updated[index] = val;
    updateField('bodyParagraphs', updated);
  };

  const addParagraph = (afterIndex: number) => {
    const updated = [...letter.bodyParagraphs];
    updated.splice(afterIndex + 1, 0, 'New paragraph content...');
    updateField('bodyParagraphs', updated);
    setActiveParagraphIndex(afterIndex + 1);
  };

  const removeParagraph = (index: number) => {
    if (letter.bodyParagraphs.length <= 1) return;
    const updated = letter.bodyParagraphs.filter((_, i) => i !== index);
    updateField('bodyParagraphs', updated);
  };

  const moveParagraph = (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= letter.bodyParagraphs.length) return;
    const updated = [...letter.bodyParagraphs];
    const temp = updated[index];
    updated[index] = updated[target];
    updated[target] = temp;
    updateField('bodyParagraphs', updated);
    setActiveParagraphIndex(target);
  };

  return (
    <div className="flex-1 flex flex-col items-center bg-stone-200/70 p-4 sm:p-6 lg:p-10 overflow-y-auto min-h-screen letter-paper-container">
      
      {/* Top Toolbar / Mode Toggle */}
      <div className="no-print w-full max-w-[780px] flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2">
          <div className="inline-flex bg-stone-300/80 p-0.5 rounded-lg border border-stone-300">
            <button
              onClick={() => setIsEditMode(true)}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-all ${
                isEditMode
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Interactive Edit</span>
            </button>
            <button
              onClick={() => setIsEditMode(false)}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-all ${
                !isEditMode
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Clean Preview</span>
            </button>
          </div>

          <span className="text-xs text-stone-500 hidden sm:inline">
            {isEditMode ? 'Click any field to edit directly' : 'Ready for print & export'}
          </span>
        </div>

        {/* Word Count & Stats */}
        <div className="flex items-center gap-3 text-xs text-stone-600 font-mono">
          <span>{stats.wordCount} words</span>
          <span>•</span>
          <span>~{stats.readingTimeMins} min read</span>
        </div>
      </div>

      {/* The Paper Sheet */}
      <div 
        className={`letter-sheet w-full max-w-[780px] min-h-[1050px] p-8 sm:p-12 md:p-16 rounded-sm border transition-all duration-200 ${getPaperStyles(
          letter.style.letterhead
        )} ${getFontClass(letter.style.font)}`}
        style={{
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.04)',
        }}
      >
        {/* Executive Style Letterhead Banner */}
        {letter.style.letterhead === 'executive' && letter.style.showHeader && (
          <div className="border-b-2 border-slate-900 pb-5 mb-8 flex justify-between items-end">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-slate-900 uppercase">
                {letter.sender.organization || letter.sender.name || 'Executive Office'}
              </h2>
              <p className="text-xs tracking-widest text-slate-500 uppercase mt-0.5">
                {letter.sender.title || 'Official Correspondence'}
              </p>
            </div>
            <div className="w-10 h-10 rounded border border-slate-300 flex items-center justify-center font-cinzel font-bold text-slate-800 text-lg bg-slate-50">
              {(letter.sender.organization?.[0] || letter.sender.name?.[0] || 'A').toUpperCase()}
            </div>
          </div>
        )}

        {/* Classic Style Crest / Monogram */}
        {letter.style.letterhead === 'classic' && letter.style.showHeader && (
          <div className="text-center border-b border-stone-300 pb-6 mb-8">
            <div className="inline-block px-3 py-1 border border-stone-400/60 rounded text-[11px] font-cinzel tracking-widest uppercase text-stone-700 mb-2">
              {letter.sender.organization || 'Correspondence'}
            </div>
            {letter.sender.name && (
              <h2 className="text-xl font-medium tracking-wide text-stone-900">
                {letter.sender.name}
              </h2>
            )}
            {letter.sender.title && (
              <p className="text-xs text-stone-600 italic">
                {letter.sender.title}
              </p>
            )}
            {letter.sender.address && (
              <p className="text-xs text-stone-500 mt-1 whitespace-pre-line">
                {letter.sender.address}
              </p>
            )}
            {letter.sender.contact && (
              <p className="text-xs text-stone-500 mt-0.5">
                {letter.sender.contact}
              </p>
            )}
          </div>
        )}

        {/* Linen Style Header */}
        {letter.style.letterhead === 'linen' && letter.style.showHeader && (
          <div className="border-b border-amber-800/20 pb-5 mb-8 flex items-center justify-between">
            <div>
              <div className="text-base font-serif font-semibold text-stone-900">
                {letter.sender.name || 'Private Correspondence'}
              </div>
              <div className="text-xs text-stone-600 italic mt-0.5">
                {letter.sender.title ? `${letter.sender.title} • ` : ''}
                {letter.sender.organization}
              </div>
            </div>
            <div className="text-right text-xs text-stone-600">
              <div>{letter.sender.contact}</div>
              <div className="text-[11px] text-stone-500">{letter.sender.address}</div>
            </div>
          </div>
        )}

        {/* Minimal Style Simple Header */}
        {letter.style.letterhead === 'minimal' && letter.style.showHeader && (
          <div className="mb-8">
            <div className="text-sm font-semibold text-neutral-900">
              {letter.sender.name}
            </div>
            <div className="text-xs text-neutral-500">
              {letter.sender.title} {letter.sender.organization && `• ${letter.sender.organization}`}
            </div>
            <div className="text-xs text-neutral-500 whitespace-pre-line mt-0.5">
              {letter.sender.address}
            </div>
            <div className="text-xs text-neutral-400 mt-0.5">
              {letter.sender.contact}
            </div>
          </div>
        )}

        {/* Date Field */}
        {letter.style.showDate && (
          <div className="mb-6">
            {isEditMode ? (
              <input
                type="text"
                value={letter.date}
                onChange={(e) => updateField('date', e.target.value)}
                placeholder="Date (e.g. October 14, 2026)"
                className="w-full text-sm text-stone-700 bg-transparent border-b border-transparent hover:border-stone-300 focus:border-amber-600 focus:outline-none py-0.5"
              />
            ) : (
              <div className="text-sm text-stone-700">{letter.date}</div>
            )}
          </div>
        )}

        {/* Recipient Block */}
        <div className="mb-6 max-w-sm">
          {isEditMode ? (
            <div className="space-y-1">
              <input
                type="text"
                value={letter.recipient.name}
                onChange={(e) => updateRecipient('name', e.target.value)}
                placeholder="Recipient Name (e.g. Eleanor Sterling)"
                className="w-full text-sm font-medium text-stone-900 bg-transparent border-b border-transparent hover:border-stone-300 focus:border-amber-600 focus:outline-none"
              />
              <input
                type="text"
                value={letter.recipient.title}
                onChange={(e) => updateRecipient('title', e.target.value)}
                placeholder="Recipient Title (e.g. Head of Product Design)"
                className="w-full text-xs text-stone-600 bg-transparent border-b border-transparent hover:border-stone-300 focus:border-amber-600 focus:outline-none"
              />
              <input
                type="text"
                value={letter.recipient.organization}
                onChange={(e) => updateRecipient('organization', e.target.value)}
                placeholder="Recipient Organization (e.g. Apex Innovations)"
                className="w-full text-xs text-stone-600 bg-transparent border-b border-transparent hover:border-stone-300 focus:border-amber-600 focus:outline-none"
              />
              <textarea
                value={letter.recipient.address}
                onChange={(e) => updateRecipient('address', e.target.value)}
                placeholder="Recipient Address (street, suite, city, state, zip)"
                rows={2}
                className="w-full text-xs text-stone-500 bg-transparent border-b border-transparent hover:border-stone-300 focus:border-amber-600 focus:outline-none resize-none leading-relaxed"
              />
            </div>
          ) : (
            <div className="text-sm text-stone-800 leading-relaxed">
              {letter.recipient.name && <div className="font-medium">{letter.recipient.name}</div>}
              {letter.recipient.title && <div className="text-xs text-stone-600">{letter.recipient.title}</div>}
              {letter.recipient.organization && <div className="text-xs text-stone-600">{letter.recipient.organization}</div>}
              {letter.recipient.address && (
                <div className="text-xs text-stone-500 whitespace-pre-line mt-0.5">{letter.recipient.address}</div>
              )}
            </div>
          )}
        </div>

        {/* Subject Line (if enabled) */}
        {letter.style.showSubject && (
          <div className="mb-6 pt-2">
            {isEditMode ? (
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-600 shrink-0">
                  RE:
                </span>
                <input
                  type="text"
                  value={letter.subject}
                  onChange={(e) => updateField('subject', e.target.value)}
                  placeholder="Subject line..."
                  className="w-full text-sm font-semibold text-stone-900 bg-transparent border-b border-transparent hover:border-stone-300 focus:border-amber-600 focus:outline-none py-0.5"
                />
              </div>
            ) : (
              letter.subject && (
                <div className="text-sm font-semibold text-stone-900">
                  RE: {letter.subject}
                </div>
              )
            )}
          </div>
        )}

        {/* Salutation */}
        <div className="mb-6">
          {isEditMode ? (
            <input
              type="text"
              value={letter.salutation}
              onChange={(e) => updateField('salutation', e.target.value)}
              placeholder="Salutation (e.g. Dear Ms. Sterling,)"
              className="w-full text-base font-medium text-stone-900 bg-transparent border-b border-transparent hover:border-stone-300 focus:border-amber-600 focus:outline-none py-0.5"
            />
          ) : (
            <div className="text-base font-medium text-stone-900">{letter.salutation}</div>
          )}
        </div>

        {/* Body Paragraphs */}
        <div className="space-y-5 mb-8">
          {letter.bodyParagraphs.map((paragraph, index) => (
            <div
              key={index}
              className={`group relative rounded-sm transition-colors ${
                isEditMode ? 'p-1 hover:bg-amber-50/50' : ''
              }`}
              onMouseEnter={() => setActiveParagraphIndex(index)}
            >
              {isEditMode ? (
                <textarea
                  value={paragraph}
                  onChange={(e) => handleParagraphChange(index, e.target.value)}
                  rows={Math.max(2, Math.ceil(paragraph.length / 75))}
                  className="w-full text-base text-stone-800 bg-transparent focus:bg-white focus:ring-1 focus:ring-amber-500 rounded border-0 focus:outline-none resize-none leading-relaxed p-1"
                />
              ) : (
                <p className="text-base text-stone-800 leading-relaxed text-justify">
                  {paragraph}
                </p>
              )}

              {/* Floating Paragraph Controls (in Edit Mode) */}
              {isEditMode && activeParagraphIndex === index && (
                <div className="no-print absolute -right-3 -top-3 hidden group-hover:flex items-center gap-1 bg-stone-900 text-stone-200 px-1.5 py-0.5 rounded-md shadow-md text-xs z-10">
                  <button
                    onClick={() => onRephraseParagraph(index, paragraph)}
                    title="AI Rephrase this paragraph"
                    disabled={rephrasingIndex === index}
                    className="p-1 hover:text-amber-300 transition-colors flex items-center gap-1"
                  >
                    <Sparkles className={`w-3 h-3 text-amber-400 ${rephrasingIndex === index ? 'animate-spin' : ''}`} />
                    <span className="text-[10px]">Rephrase</span>
                  </button>

                  <div className="w-px h-3 bg-stone-700 mx-0.5" />

                  <button
                    onClick={() => moveParagraph(index, 'up')}
                    disabled={index === 0}
                    title="Move up"
                    className="p-1 hover:text-stone-100 disabled:opacity-30"
                  >
                    <ArrowUp className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => moveParagraph(index, 'down')}
                    disabled={index === letter.bodyParagraphs.length - 1}
                    title="Move down"
                    className="p-1 hover:text-stone-100 disabled:opacity-30"
                  >
                    <ArrowDown className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => addParagraph(index)}
                    title="Add paragraph below"
                    className="p-1 hover:text-stone-100"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => removeParagraph(index)}
                    disabled={letter.bodyParagraphs.length <= 1}
                    title="Delete paragraph"
                    className="p-1 hover:text-rose-400 disabled:opacity-30"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          ))}

          {/* Add Paragraph Button */}
          {isEditMode && (
            <button
              onClick={() => addParagraph(letter.bodyParagraphs.length - 1)}
              className="no-print w-full py-2 border border-dashed border-stone-300 hover:border-amber-500 text-stone-500 hover:text-amber-700 text-xs rounded transition-colors flex items-center justify-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Paragraph</span>
            </button>
          )}
        </div>

        {/* Valediction / Sign-off Block */}
        <div className="mb-6 max-w-xs">
          {isEditMode ? (
            <div className="space-y-1">
              <input
                type="text"
                value={letter.valediction}
                onChange={(e) => updateField('valediction', e.target.value)}
                placeholder="Valediction (e.g. Sincerely, or Warm regards,)"
                className="w-full text-base text-stone-900 bg-transparent border-b border-transparent hover:border-stone-300 focus:border-amber-600 focus:outline-none py-0.5"
              />
              <div className="h-10" /> {/* Space for signature */}
              <input
                type="text"
                value={letter.sender.name}
                onChange={(e) => updateSender('name', e.target.value)}
                placeholder="Sender Name"
                className="w-full text-sm font-semibold text-stone-900 bg-transparent border-b border-transparent hover:border-stone-300 focus:border-amber-600 focus:outline-none"
              />
              <input
                type="text"
                value={letter.sender.title}
                onChange={(e) => updateSender('title', e.target.value)}
                placeholder="Sender Title"
                className="w-full text-xs text-stone-600 bg-transparent border-b border-transparent hover:border-stone-300 focus:border-amber-600 focus:outline-none"
              />
              <input
                type="text"
                value={letter.sender.organization}
                onChange={(e) => updateSender('organization', e.target.value)}
                placeholder="Sender Organization"
                className="w-full text-xs text-stone-500 bg-transparent border-b border-transparent hover:border-stone-300 focus:border-amber-600 focus:outline-none"
              />
            </div>
          ) : (
            <div>
              <div className="text-base text-stone-900">{letter.valediction}</div>
              <div className="h-12 flex items-center">
                {/* Visual signature placeholder */}
                <span className="text-stone-300 italic text-sm font-serif select-none">
                  (Signature)
                </span>
              </div>
              <div className="text-sm font-semibold text-stone-900">{letter.sender.name}</div>
              {letter.sender.title && <div className="text-xs text-stone-600">{letter.sender.title}</div>}
              {letter.sender.organization && <div className="text-xs text-stone-500">{letter.sender.organization}</div>}
            </div>
          )}
        </div>

        {/* Postscript (P.S.) */}
        {(letter.postscript || isEditMode) && (
          <div className="mt-8 pt-4 border-t border-stone-200/60">
            {isEditMode ? (
              <div className="flex items-start gap-2">
                <span className="text-xs font-semibold text-stone-500 pt-1 shrink-0">P.S.</span>
                <textarea
                  value={letter.postscript}
                  onChange={(e) => updateField('postscript', e.target.value)}
                  placeholder="Optional Postscript (P.S.)..."
                  rows={2}
                  className="w-full text-xs text-stone-600 italic bg-transparent border-b border-transparent hover:border-stone-300 focus:border-amber-600 focus:outline-none resize-none leading-relaxed"
                />
              </div>
            ) : (
              letter.postscript && (
                <div className="text-xs text-stone-600 italic">
                  {letter.postscript.startsWith('P.S.') ? letter.postscript : `P.S. ${letter.postscript}`}
                </div>
              )
            )}
          </div>
        )}

      </div>
    </div>
  );
};
