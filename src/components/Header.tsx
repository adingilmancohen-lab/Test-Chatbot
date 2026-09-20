import React, { useState } from 'react';
import { 
  Copy, 
  Check, 
  Printer, 
  RotateCcw,
  School,
  Info
} from 'lucide-react';
import { GeneratedEmailData } from '../types';

interface HeaderProps {
  email: GeneratedEmailData | null;
  onOpenSystemDiagram: () => void;
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  email,
  onOpenSystemDiagram,
  onReset,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!email) return;
    const fullText = [
      `To: ${email.recipientEmail || email.recipientName}`,
      `Subject: ${email.subject}`,
      '',
      email.salutation,
      '',
      ...email.bodyParagraphs,
      '',
      email.valediction,
      email.senderName,
      email.postscript ? `\n${email.postscript}` : '',
    ].join('\n');

    await navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <header className="no-print bg-[#002549] text-stone-100 border-b border-[#00172e] sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-lg bg-[#003262] border border-[#FDB515]/40 flex items-center justify-center text-[#FDB515] shrink-0 shadow-inner">
            <School className="w-5 h-5" />
          </div>
          
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold tracking-wider uppercase text-[#FDB515] font-cinzel">
                Reliable Peer
              </span>
              <span className="text-blue-200/60 text-xs hidden sm:inline">•</span>
              <span className="text-xs text-blue-100/90 truncate hidden sm:inline">
                UC Berkeley MDes Assistant
              </span>
            </div>
            <p className="text-[11px] text-blue-200/70 truncate hidden md:block">
              Syllabus-grounded studio correspondence for Jacobs Hall
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          
          {/* Info Button - Opens System Diagram */}
          <button
            id="info-system-diagram-btn"
            onClick={onOpenSystemDiagram}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#002549] bg-[#FDB515] hover:bg-amber-300 rounded-md transition-all shadow-xs active:scale-95"
            title="View system diagram (Input, Output, Knowledge Base, System Instructions, LLM)"
          >
            <Info className="w-4 h-4" />
            <span>Info</span>
          </button>

          {/* Reset / New */}
          <button
            id="reset-prompt-btn"
            onClick={onReset}
            title="Start with fresh prompt"
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-stone-300 hover:text-white hover:bg-[#003262] rounded-md transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          {/* Copy Button (only if email exists) */}
          {email && (
            <button
              id="copy-email-header-btn"
              onClick={handleCopy}
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
          )}

          {/* Print / Save PDF */}
          <button
            id="print-btn"
            onClick={handlePrint}
            title="Print or Save as PDF"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-100 hover:text-white bg-[#003262] hover:bg-[#002549] border border-blue-400/30 rounded-md transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Print</span>
          </button>

        </div>
      </div>
    </header>
  );
};
