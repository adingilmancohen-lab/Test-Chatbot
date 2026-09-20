import React, { useState } from 'react';
import { 
  Copy, 
  Check, 
  Printer, 
  RotateCcw,
  Info
} from 'lucide-react';
import { GeneratedEmailData } from '../types';
import { BoschFountain, BoschStrawberry, BoschOwl, BoschTriptychWings } from './BoschIcons';

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
    <header className="no-print bg-[#161913] text-[#e8dfc8] border-b-2 border-[#594022] sticky top-0 z-30 shadow-2xl">
      {/* Decorative Flemish Gothic gold trimmer */}
      <div className="h-1 bg-gradient-to-r from-[#2b1d0c] via-[#d4af37] to-[#2b1d0c] w-full" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        
        {/* Brand with Bosch Triptych motif */}
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-11 h-11 rounded-lg bg-[#2a2417] border-2 border-[#d4af37]/60 flex items-center justify-center text-[#d4af37] shrink-0 shadow-lg relative group overflow-hidden">
            <BoschFountain className="w-7 h-7 drop-shadow-md group-hover:scale-110 transition-transform" />
            <div className="absolute inset-0 bg-radial from-[#e06b75]/20 to-transparent pointer-events-none" />
          </div>
          
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-bold tracking-widest text-[#f5d77f] font-almendra drop-shadow-sm flex items-center gap-1.5">
                Reliable Peer
              </span>
              <span className="text-[#a48858] text-xs hidden sm:inline">✤</span>
              <span className="text-xs text-[#c9b996] font-medieval truncate hidden sm:inline tracking-wide">
                Garden of Earthly Delights
              </span>
            </div>
            <p className="text-[11px] text-[#9a8d71] font-serif italic truncate hidden md:block">
              Syllabus-grounded studio correspondence for Jacobs Hall • Netherlandish Renaissance Edition
            </p>
          </div>
        </div>

        {/* Action Controls styled like ornate Renaissance book clasps */}
        <div className="flex items-center gap-2.5">
          
          {/* Info Button - Opens System Diagram */}
          <button
            id="info-system-diagram-btn"
            onClick={onOpenSystemDiagram}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#1a1c14] bg-gradient-to-b from-[#f5d77f] to-[#d4af37] hover:from-[#fdf0cd] hover:to-[#e5c158] border border-[#f5d77f] rounded-md transition-all shadow-md active:scale-95 font-medieval tracking-wide"
            title="Inspect the 5-part mystical system diagram"
          >
            <BoschOwl className="w-4 h-4 text-[#2a1d0c]" />
            <span>Codex Info</span>
          </button>

          {/* Reset / New */}
          <button
            id="reset-prompt-btn"
            onClick={onReset}
            title="Clean slate parchment"
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-[#c4b595] hover:text-[#f7f0df] hover:bg-[#2b271c] border border-[#4a3f2c] rounded-md transition-colors font-serif"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#d4af37]" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          {/* Copy Button (only if email exists) */}
          {email && (
            <button
              id="copy-email-header-btn"
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#f5d77f] bg-[#2d2518] hover:bg-[#3d3321] rounded-md border border-[#7a5832] transition-colors font-serif"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300 font-semibold">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>Copy</span>
                </>
              )}
            </button>
          )}

          {/* Print / Save PDF */}
          <button
            id="print-btn"
            onClick={handlePrint}
            title="Illuminated folio print"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#e4d6b6] hover:text-white bg-[#22281a] hover:bg-[#2c3522] border border-[#526343] rounded-md transition-colors font-serif"
          >
            <Printer className="w-3.5 h-3.5 text-[#88ab75]" />
            <span className="hidden sm:inline">Folio Print</span>
          </button>

        </div>
      </div>
    </header>
  );
};
