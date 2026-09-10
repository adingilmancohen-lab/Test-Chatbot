import React, { useState } from 'react';
import { 
  Feather, 
  Printer, 
  Copy, 
  Check, 
  FolderOpen, 
  Plus, 
  FileText, 
  Sparkles,
  Download,
  RotateCcw,
  Cpu,
  School
} from 'lucide-react';
import { LetterData } from '../types';
import { letterToPlainText } from '../utils/formatters';

interface HeaderProps {
  currentLetter: LetterData;
  onUpdateTitle: (title: string) => void;
  onNewLetter: () => void;
  onOpenSavedModal: () => void;
  onOpenTemplatesModal: () => void;
  onOpenReplyModal: () => void;
  onOpenSystemDiagram: () => void;
  savedCount: number;
  isSaving: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentLetter,
  onUpdateTitle,
  onNewLetter,
  onOpenSavedModal,
  onOpenTemplatesModal,
  onOpenReplyModal,
  onOpenSystemDiagram,
  savedCount,
  isSaving,
}) => {
  const [copied, setCopied] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(currentLetter.title);

  const handleCopy = async () => {
    const text = letterToPlainText(currentLetter);
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const text = letterToPlainText(currentLetter);
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${currentLetter.title.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'letter'}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const saveTitle = () => {
    if (titleInput.trim()) {
      onUpdateTitle(titleInput.trim());
    } else {
      setTitleInput(currentLetter.title);
    }
    setIsEditingTitle(false);
  };

  return (
    <header className="no-print bg-[#002549] text-stone-100 border-b border-[#00172e] sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand & Document Name */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-lg bg-[#003262] border border-[#FDB515]/40 flex items-center justify-center text-[#FDB515] shrink-0 shadow-inner">
            <School className="w-5 h-5" />
          </div>
          
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold tracking-wider uppercase text-[#FDB515] font-cinzel">
                Reliable Peer
              </span>
              <span className="text-blue-200/60 text-xs">•</span>
              <span className="text-[11px] text-blue-100/80 truncate hidden sm:inline font-mono">
                Berkeley MDes Studio Assistant
              </span>
            </div>

            {isEditingTitle ? (
              <input
                type="text"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                onBlur={saveTitle}
                onKeyDown={(e) => e.key === 'Enter' && saveTitle()}
                autoFocus
                className="bg-stone-800 text-stone-100 px-2 py-0.5 rounded text-sm font-medium border border-amber-500/50 focus:outline-none w-48 sm:w-64"
              />
            ) : (
              <h1 
                onClick={() => {
                  setTitleInput(currentLetter.title);
                  setIsEditingTitle(true);
                }}
                title="Click to rename"
                className="text-sm font-semibold text-stone-200 hover:text-amber-200 cursor-pointer truncate max-w-[180px] sm:max-w-xs transition-colors"
              >
                {currentLetter.title || 'Untitled Letter'}
              </h1>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* System Diagram Button */}
          <button
            id="header-diagram-btn"
            onClick={onOpenSystemDiagram}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#002549] bg-[#FDB515] hover:bg-amber-300 rounded-md transition-colors shadow-xs"
          >
            <Cpu className="w-4 h-4" />
            <span>System Diagram</span>
          </button>

          {/* Templates */}
          <button
            id="header-templates-btn"
            onClick={onOpenTemplatesModal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-300 hover:text-stone-100 hover:bg-[#003262] rounded-md transition-colors"
          >
            <FileText className="w-4 h-4 text-stone-400" />
            <span className="hidden md:inline">Templates</span>
          </button>

          {/* Reply Assistant */}
          <button
            id="header-reply-btn"
            onClick={onOpenReplyModal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-200 hover:text-white hover:bg-[#003262] rounded-md transition-colors border border-blue-400/30"
          >
            <Sparkles className="w-4 h-4 text-[#FDB515]" />
            <span className="hidden md:inline">Reply Assistant</span>
          </button>

          {/* Saved Drafts */}
          <button
            id="header-saved-btn"
            onClick={onOpenSavedModal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-300 hover:text-stone-100 hover:bg-[#003262] rounded-md transition-colors relative"
          >
            <FolderOpen className="w-4 h-4 text-stone-400" />
            <span className="hidden md:inline">Drafts</span>
            {savedCount > 0 && (
              <span className="bg-[#003262] text-amber-300 text-[10px] px-1.5 py-0.2 rounded-full font-mono border border-blue-400/30">
                {savedCount}
              </span>
            )}
          </button>

          <div className="h-5 w-px bg-stone-700/60 mx-1 hidden sm:block" />

          {/* New Letter */}
          <button
            id="header-new-btn"
            onClick={onNewLetter}
            title="Start new letter"
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-stone-300 hover:text-stone-100 hover:bg-[#003262] rounded-md transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New</span>
          </button>

          {/* Copy Plain Text */}
          <button
            id="header-copy-btn"
            onClick={handleCopy}
            title="Copy letter to clipboard"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-200 bg-stone-800 hover:bg-stone-700 rounded-md border border-stone-700 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-stone-400" />
                <span>Copy</span>
              </>
            )}
          </button>

          {/* Download Text */}
          <button
            id="header-download-btn"
            onClick={handleDownload}
            title="Download text file (.txt)"
            className="p-1.5 text-stone-300 hover:text-stone-100 hover:bg-[#003262] rounded-md transition-colors hidden sm:inline-flex"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* Print / Save PDF */}
          <button
            id="header-print-btn"
            onClick={handlePrint}
            title="Print or Save as PDF"
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-[#003262] hover:bg-[#001f3f] text-[#FDB515] border border-[#FDB515]/40 rounded-md shadow-sm transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Print / PDF</span>
          </button>
        </div>
      </div>
    </header>
  );
};
