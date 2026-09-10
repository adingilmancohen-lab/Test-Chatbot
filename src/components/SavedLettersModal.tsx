import React, { useState } from 'react';
import { 
  X, 
  FolderOpen, 
  Trash2, 
  Copy, 
  FileText, 
  Calendar, 
  Search,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { LetterData } from '../types';

interface SavedLettersModalProps {
  isOpen: boolean;
  onClose: () => void;
  letters: LetterData[];
  currentLetterId: string;
  onSelectLetter: (letter: LetterData) => void;
  onDeleteLetter: (id: string) => void;
  onDuplicateLetter: (letter: LetterData) => void;
}

export const SavedLettersModal: React.FC<SavedLettersModalProps> = ({
  isOpen,
  onClose,
  letters,
  currentLetterId,
  onSelectLetter,
  onDeleteLetter,
  onDuplicateLetter,
}) => {
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filtered = letters.filter((l) => {
    const q = search.toLowerCase();
    return (
      l.title.toLowerCase().includes(q) ||
      l.recipient.name.toLowerCase().includes(q) ||
      (l.subject && l.subject.toLowerCase().includes(q)) ||
      l.bodyParagraphs.some((p) => p.toLowerCase().includes(q))
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs no-print">
      <div className="bg-white rounded-xl shadow-2xl border border-stone-200 w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div>
            <h2 className="text-base font-semibold text-stone-900 flex items-center gap-2">
              <FolderOpen className="w-5 h-5 text-amber-600" />
              <span>Saved Letter Drafts ({letters.length})</span>
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Drafts are stored locally in your browser so your correspondence is always preserved.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-700 rounded-md hover:bg-stone-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-3 border-b border-stone-100 bg-stone-50/50">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, recipient, or content..."
              className="w-full text-xs pl-9 pr-3 py-2 bg-white border border-stone-300 rounded-md text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* Drafts List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-stone-400 text-xs">
              No matching drafts found.
            </div>
          ) : (
            filtered.map((l) => {
              const isCurrent = l.id === currentLetterId;
              const snippet = l.bodyParagraphs[0] || 'No content yet...';

              return (
                <div
                  key={l.id}
                  className={`p-3.5 rounded-lg border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isCurrent
                      ? 'border-amber-600 bg-amber-50/50 ring-1 ring-amber-500/40'
                      : 'border-stone-200 bg-white hover:border-stone-300'
                  }`}
                >
                  <div 
                    onClick={() => {
                      onSelectLetter(l);
                      onClose();
                    }}
                    className="flex-1 cursor-pointer min-w-0"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-xs font-semibold text-stone-900 truncate">
                        {l.title || 'Untitled Letter'}
                      </h4>
                      {isCurrent && (
                        <span className="text-[10px] font-medium bg-amber-200 text-amber-900 px-1.5 py-0.2 rounded">
                          Current
                        </span>
                      )}
                      <span className="text-[10px] text-stone-400 font-mono capitalize">
                        {l.category}
                      </span>
                    </div>

                    <p className="text-xs text-stone-500 line-clamp-1 italic">
                      "{snippet}"
                    </p>

                    <div className="flex items-center gap-3 text-[11px] text-stone-400 mt-1">
                      <span>To: {l.recipient.name || 'Unspecified'}</span>
                      <span>•</span>
                      <span>{new Date(l.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                    <button
                      onClick={() => onDuplicateLetter(l)}
                      title="Duplicate Draft"
                      className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onDeleteLetter(l.id)}
                      disabled={letters.length <= 1}
                      title="Delete Draft"
                      className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors disabled:opacity-30"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => {
                        onSelectLetter(l);
                        onClose();
                      }}
                      className="px-2.5 py-1 bg-stone-900 hover:bg-stone-800 text-stone-100 text-xs font-medium rounded transition-colors flex items-center gap-1"
                    >
                      <span>Open</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-stone-200 bg-stone-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-700 text-xs font-medium rounded-md transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
