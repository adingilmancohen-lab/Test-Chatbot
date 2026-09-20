import React, { useState } from 'react';
import { 
  X, 
  User, 
  FileCode2, 
  BookOpen, 
  Cpu, 
  Mail, 
  Sparkles, 
  CheckCircle2, 
  ExternalLink,
  Code
} from 'lucide-react';
import { 
  DESINV_202_SYLLABUS, 
  DESINV_200_SYLLABUS, 
  SYSTEM_INSTRUCTIONS_TEXT 
} from '../data/syllabusKnowledgeBase';
import { 
  BoschFountain, 
  BoschOwl, 
  BoschStrawberry, 
  BoschCreature, 
  BoschTriptychWings 
} from './BoschIcons';

interface SystemDiagramModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPrompt?: string;
  userName?: string;
}

export type SystemDiagramNodeId = 
  | 'input' 
  | 'system_instructions' 
  | 'knowledge_base' 
  | 'llm_model' 
  | 'output';

export const SystemDiagramModal: React.FC<SystemDiagramModalProps> = ({
  isOpen,
  onClose,
  currentPrompt = '',
  userName = 'Alex',
}) => {
  const [selectedNode, setSelectedNode] = useState<SystemDiagramNodeId>('knowledge_base');
  const [activeSyllabusTab, setActiveSyllabusTab] = useState<'desinv202' | 'desinv200'>('desinv202');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xs no-print overflow-y-auto">
      <div className="bg-[#1c1e16] text-[#e8dfc8] rounded-xl shadow-2xl border-2 border-[#6d5433] w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 bosch-wood-frame">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b-2 border-[#544129] bg-[#161811] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#272317] text-[#d4af37] border-2 border-[#d4af37]/60 flex items-center justify-center font-bold shadow-md">
              <BoschFountain className="w-6 h-6 text-[#e06b75]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-[#f5d77f] font-almendra tracking-wider">
                  The Alchemical Scriptorium & System Architecture
                </h2>
                <span className="text-[10px] uppercase tracking-wider font-medieval font-semibold bg-[#3d321e] text-[#f5d77f] border border-[#7a5832] px-2 py-0.5 rounded">
                  Boschian Codex
                </span>
              </div>
              <p className="text-xs text-[#a4967a] font-serif italic">
                A 5-fold mystic illumination: Scribe Input ➔ Studio Covenants & Syllabi ➔ Gemini 3.8 Flash ➔ Ready Epistle
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#9a8c72] hover:text-[#fff4dc] hover:bg-[#2b271b] border border-transparent hover:border-[#5a482e] rounded-md transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-[#161811]">
          
          {/* Top Pipeline Flow Bar */}
          <div className="bg-[#1f2219] p-4 sm:p-5 rounded-xl border-2 border-[#544129] shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#d4af37] font-almendra flex items-center gap-1.5">
                <BoschOwl className="w-4 h-4 text-[#d4af37]" />
                <span>Select any node below to inspect scriptorium specifications:</span>
              </span>
              <span className="text-[11px] text-[#9a8c72] font-medieval">
                Five-Fold Pipeline
              </span>
            </div>

            {/* 5-Node Flow Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5 relative">
              
              {/* 1. Input */}
              <button
                onClick={() => setSelectedNode('input')}
                className={`p-3 rounded-lg border-2 text-left transition-all flex flex-col justify-between ${
                  selectedNode === 'input'
                    ? 'border-[#d4af37] bg-[#2d291e] shadow-md ring-2 ring-[#d4af37]/30'
                    : 'border-[#4a3d2b] bg-[#1a1c14] hover:border-[#6e5839]'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold text-[#f5d77f] font-almendra">
                  <span>1. Scribe Input</span>
                  <User className="w-4 h-4 text-[#d4af37]" />
                </div>
                <div className="mt-2 text-[11px] text-[#c9ba98] font-serif">
                  Student Name & Ask
                </div>
                <div className="mt-2 text-[10px] font-mono text-[#e8dfc8] truncate bg-[#26281e] p-1.5 rounded border border-[#4d3f2c]">
                  {currentPrompt ? `"${currentPrompt.slice(0, 24)}..."` : 'Student petition'}
                </div>
              </button>

              {/* 2. System Instructions */}
              <button
                onClick={() => setSelectedNode('system_instructions')}
                className={`p-3 rounded-lg border-2 text-left transition-all flex flex-col justify-between ${
                  selectedNode === 'system_instructions'
                    ? 'border-[#d4af37] bg-[#2d291e] shadow-md ring-2 ring-[#d4af37]/30'
                    : 'border-[#4a3d2b] bg-[#1a1c14] hover:border-[#6e5839]'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold text-[#f5d77f] font-almendra">
                  <span>2. Covenants</span>
                  <FileCode2 className="w-4 h-4 text-[#d4af37]" />
                </div>
                <div className="mt-2 text-[11px] text-[#c9ba98] font-serif">
                  MDes Directives
                </div>
                <div className="mt-2 text-[10px] font-mono text-[#e8dfc8] truncate bg-[#26281e] p-1.5 rounded border border-[#4d3f2c]">
                  First-name • Studio
                </div>
              </button>

              {/* 3. Knowledge Base */}
              <button
                onClick={() => setSelectedNode('knowledge_base')}
                className={`p-3 rounded-lg border-2 text-left transition-all flex flex-col justify-between ${
                  selectedNode === 'knowledge_base'
                    ? 'border-[#e06b75] bg-[#332223] shadow-md ring-2 ring-[#e06b75]/30'
                    : 'border-[#4a3d2b] bg-[#1a1c14] hover:border-[#6e5839]'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold text-[#f5d77f] font-almendra">
                  <span>3. Syllabi Base</span>
                  <BookOpen className="w-4 h-4 text-[#e06b75]" />
                </div>
                <div className="mt-2 text-[11px] text-[#e06b75] font-serif font-medium">
                  Course Syllabi
                </div>
                <div className="mt-2 text-[10px] font-mono text-[#ffd166] truncate bg-[#26281e] p-1.5 rounded border border-[#4d3f2c]">
                  DESINV 202 & 200
                </div>
              </button>

              {/* 4. LLM Model Involved */}
              <button
                onClick={() => setSelectedNode('llm_model')}
                className={`p-3 rounded-lg border-2 text-left transition-all flex flex-col justify-between ${
                  selectedNode === 'llm_model'
                    ? 'border-[#d4af37] bg-[#2d291e] shadow-md ring-2 ring-[#d4af37]/30'
                    : 'border-[#4a3d2b] bg-[#1a1c14] hover:border-[#6e5839]'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold text-[#f5d77f] font-almendra">
                  <span>4. Alchemist LLM</span>
                  <Cpu className="w-4 h-4 text-[#d4af37]" />
                </div>
                <div className="mt-2 text-[11px] text-[#c9ba98] font-serif">
                  gemini-3.8-flash
                </div>
                <div className="mt-2 text-[10px] font-mono text-[#e8dfc8] truncate bg-[#26281e] p-1.5 rounded border border-[#4d3f2c]">
                  JSON Schema
                </div>
              </button>

              {/* 5. Output */}
              <button
                onClick={() => setSelectedNode('output')}
                className={`p-3 rounded-lg border-2 text-left transition-all flex flex-col justify-between ${
                  selectedNode === 'output'
                    ? 'border-[#52b788] bg-[#1e2b23] shadow-md ring-2 ring-[#52b788]/30'
                    : 'border-[#4a3d2b] bg-[#1a1c14] hover:border-[#6e5839]'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold text-[#f5d77f] font-almendra">
                  <span>5. Completed Epistle</span>
                  <Mail className="w-4 h-4 text-[#52b788]" />
                </div>
                <div className="mt-2 text-[11px] text-[#52b788] font-serif">
                  Ready-to-Send
                </div>
                <div className="mt-2 text-[10px] font-mono text-[#ffd166] truncate bg-[#26281e] p-1.5 rounded border border-[#4d3f2c]">
                  Missive + Policy
                </div>
              </button>

            </div>
          </div>

          {/* Bottom Detailed Inspection Pane styled like illuminated parchment */}
          <div className="bg-[#1f2219] p-5 sm:p-6 rounded-xl border-2 border-[#544129] shadow-lg">
            
            {/* 1. INPUT NODE DETAIL */}
            {selectedNode === 'input' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[#3d3321] pb-3">
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5 text-[#d4af37]" />
                    <h3 className="text-base font-bold text-[#f5d77f] font-almendra">
                      Component 1: Scribe Identity & Prompt Input
                    </h3>
                  </div>
                  <span className="text-xs font-medieval bg-[#2e2a1d] text-[#f5d77f] border border-[#6b5534] px-2.5 py-1 rounded">
                    Student Interface
                  </span>
                </div>

                <p className="text-xs text-[#c9b998] font-serif leading-relaxed">
                  The student sets their name (currently <strong>"{userName}"</strong>) and inputs their intent into a single text chamber. Any generated epistle can be further transmuted by typing feedback into the revision module.
                </p>

                <div className="bg-[#181a13] p-4 rounded-lg border border-[#4a3e2c] space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#f5d77f] font-almendra">
                    <span>Currently Inscribed Petition:</span>
                    <span className="font-mono text-[#9a8c72] text-[11px]">Scribe: {userName}</span>
                  </div>
                  <div className="p-3 bg-[#24271e] rounded border border-[#3e3423] text-xs font-serif text-[#e4dac0] whitespace-pre-wrap">
                    {currentPrompt || '(No petition entered yet. Try typing into the main text box.)'}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs">
                  <div className="p-3 bg-[#181a13] rounded border border-[#4a3e2c]">
                    <div className="font-bold text-[#f5d77f] font-almendra mb-1">Student Identity</div>
                    <div className="text-[#a4967a] font-serif">Sign-off and valediction are tailored to {userName}, ensuring authentic studio representation.</div>
                  </div>
                  <div className="p-3 bg-[#181a13] rounded border border-[#4a3e2c]">
                    <div className="font-bold text-[#f5d77f] font-almendra mb-1">Interactive Transmutations</div>
                    <div className="text-[#a4967a] font-serif">Apply custom revision feedback (shorten, emphasize Figma, clarify office hours) interactively.</div>
                  </div>
                  <div className="p-3 bg-[#181a13] rounded border border-[#4a3e2c]">
                    <div className="font-bold text-[#f5d77f] font-almendra mb-1">Recipient Grounding</div>
                    <div className="text-[#a4967a] font-serif">Auto-routes to Hugh, Chris, Sudhu, Joris, TJ, or Alistair on an informal first-name basis.</div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. SYSTEM INSTRUCTIONS NODE DETAIL */}
            {selectedNode === 'system_instructions' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[#3d3321] pb-3">
                  <div className="flex items-center gap-2">
                    <FileCode2 className="w-5 h-5 text-[#d4af37]" />
                    <h3 className="text-base font-bold text-[#f5d77f] font-almendra">
                      Component 2: System Directives & Scriptorium Rules
                    </h3>
                  </div>
                  <span className="text-xs font-medieval bg-[#2e2a1d] text-[#f5d77f] border border-[#6b5534] px-2.5 py-1 rounded">
                    Studio Covenants
                  </span>
                </div>

                <p className="text-xs text-[#c9b998] font-serif leading-relaxed">
                  These system instructions steer the LLM to write complete, collegiate studio correspondence adhering to Jacobs Hall etiquette rather than giving generic meta-advice:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 bg-[#181a13] rounded-lg border border-[#4a3e2c] space-y-1.5">
                    <div className="font-bold text-[#f5d77f] font-almendra text-sm">Rule 1: Actual Email, Never Advice</div>
                    <p className="text-[#a89b7e] font-serif leading-relaxed">
                      Must directly output the ready-to-send email with Subject, Salutation, Body, and Valediction. No bulleted suggestions or conversational commentary.
                    </p>
                  </div>

                  <div className="p-3.5 bg-[#181a13] rounded-lg border border-[#4a3e2c] space-y-1.5">
                    <div className="font-bold text-[#f5d77f] font-almendra text-sm">Rule 2: First-Name Studio Basis</div>
                    <p className="text-[#a89b7e] font-serif leading-relaxed">
                      Always greet instructors by their first name (e.g. "Hi Hugh,", "Hi Chris,"). Never use archaic forms like "Dear Professor" or "Dear Dr.".
                    </p>
                  </div>

                  <div className="p-3.5 bg-[#181a13] rounded-lg border border-[#4a3e2c] space-y-1.5">
                    <div className="font-bold text-[#f5d77f] font-almendra text-sm">Rule 3: Medical Privacy (No Oversharing)</div>
                    <p className="text-[#a89b7e] font-serif leading-relaxed">
                      State illness concisely (e.g., fever, heading to Tang Center) without intrusive bodily details, preserving student dignity.
                    </p>
                  </div>

                  <div className="p-3.5 bg-[#181a13] rounded-lg border border-[#4a3e2c] space-y-1.5">
                    <div className="font-bold text-[#f5d77f] font-almendra text-sm">Rule 4: Studio Deliverable Accountability</div>
                    <p className="text-[#a89b7e] font-serif leading-relaxed">
                      Always confirm team deliverables (partner pinning up, shared Figma diagrams, hardware handoffs at Jacobs Hall).
                    </p>
                  </div>
                </div>

                <div className="bg-[#181a13] p-3 rounded-lg border border-[#4a3e2c]">
                  <div className="text-xs font-semibold text-[#f5d77f] font-almendra mb-1.5">
                    Verbatim System Instructions (Embedded in Prompt):
                  </div>
                  <pre className="text-[11px] font-mono text-[#dcd1b5] bg-[#12130e] p-3 rounded border border-[#2d2518] overflow-x-auto max-h-48 whitespace-pre-wrap leading-relaxed">
                    {SYSTEM_INSTRUCTIONS_TEXT}
                  </pre>
                </div>
              </div>
            )}

            {/* 3. KNOWLEDGE BASE NODE DETAIL */}
            {selectedNode === 'knowledge_base' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[#3d3321] pb-3">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-[#e06b75]" />
                    <h3 className="text-base font-bold text-[#f5d77f] font-almendra">
                      Component 3: Attached Syllabi Knowledge Base
                    </h3>
                  </div>
                  <span className="text-xs font-medieval bg-[#3d2226] text-[#ffccd1] border border-[#a33845] px-2.5 py-1 rounded">
                    Jacobs Hall Syllabi
                  </span>
                </div>

                <p className="text-xs text-[#c9b998] font-serif leading-relaxed">
                  The LLM is grounded in the full text of both core UC Berkeley MDes Fall 2026 course syllabi. When drafting or revising, it references exact course policies:
                </p>

                {/* Tabs */}
                <div className="flex gap-2 border-b border-[#3d3321] pb-2">
                  <button
                    onClick={() => setActiveSyllabusTab('desinv202')}
                    className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all font-almendra ${
                      activeSyllabusTab === 'desinv202'
                        ? 'bg-[#3d2427] text-[#ffd166] border border-[#e06b75]'
                        : 'text-[#9a8c72] hover:text-[#e4dac0] hover:bg-[#25281e]'
                    }`}
                  >
                    DESINV 202: Design of Technology Devices & Systems
                  </button>
                  <button
                    onClick={() => setActiveSyllabusTab('desinv200')}
                    className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all font-almendra ${
                      activeSyllabusTab === 'desinv200'
                        ? 'bg-[#3d2427] text-[#ffd166] border border-[#e06b75]'
                        : 'text-[#9a8c72] hover:text-[#e4dac0] hover:bg-[#25281e]'
                    }`}
                  >
                    DES INV 200: Design Frameworks (Systems)
                  </button>
                </div>

                {activeSyllabusTab === 'desinv202' && (
                  <div className="space-y-3 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <div className="p-3 bg-[#181a13] rounded border border-[#4a3e2c]">
                        <div className="font-bold text-[#f5d77f] font-almendra">Instructors</div>
                        <div className="text-[#a4967a] font-serif mt-1">Chris Myers, Sudhu Tewari, TJ McLeish, Joris Komen</div>
                      </div>
                      <div className="p-3 bg-[#181a13] rounded border border-[#4a3e2c]">
                        <div className="font-bold text-[#f5d77f] font-almendra">GSIs & Studio Staff</div>
                        <div className="text-[#a4967a] font-serif mt-1">Alistair Vizuet, Sanjana Mugalvalli</div>
                      </div>
                      <div className="p-3 bg-[#181a13] rounded border border-[#4a3e2c]">
                        <div className="font-bold text-[#f5d77f] font-almendra">Studio Location</div>
                        <div className="text-[#a4967a] font-serif mt-1">Jacobs Hall 210 / 220</div>
                      </div>
                    </div>

                    <div className="p-3.5 bg-[#2a1a1c] rounded-lg border border-[#8b3543] space-y-1">
                      <div className="font-bold text-[#fca5a5] font-almendra">Mandatory Absence Policy in Syllabus:</div>
                      <p className="text-[#fed7aa] font-serif leading-relaxed">
                        "If you need to miss all or part of a class session for illness, an emergency, religious observance, or any other reason, <strong>fill out the Absence & Tardiness Form on the bCourses home page</strong>. Notification of tardiness or absence should occur as far in advance as possible."
                      </p>
                    </div>

                    <div className="p-3.5 bg-[#181a13] rounded-lg border border-[#4a3e2c]">
                      <div className="font-bold text-[#f5d77f] font-almendra mb-1">Grading & Studio Engagement (50% weight):</div>
                      <p className="text-[#a4967a] font-serif leading-relaxed">
                        Class participation and engagement account for 50% of the course grade. Unexcused absence directly affects the final mark, making responsible partner handoff and timely notification critical.
                      </p>
                    </div>
                  </div>
                )}

                {activeSyllabusTab === 'desinv200' && (
                  <div className="space-y-3 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <div className="p-3 bg-[#181a13] rounded border border-[#4a3e2c]">
                        <div className="font-bold text-[#f5d77f] font-almendra">Instructor</div>
                        <div className="text-[#a4967a] font-serif mt-1">Hugh Dubberly (dubberly@berkeley.edu)</div>
                      </div>
                      <div className="p-3 bg-[#181a13] rounded border border-[#4a3e2c]">
                        <div className="font-bold text-[#f5d77f] font-almendra">Core Deliverable</div>
                        <div className="text-[#a4967a] font-serif mt-1">Weekly 11x17 concept map & Systems Diagrams</div>
                      </div>
                      <div className="p-3 bg-[#181a13] rounded border border-[#4a3e2c]">
                        <div className="font-bold text-[#f5d77f] font-almendra">Studio Location</div>
                        <div className="text-[#a4967a] font-serif mt-1">Jacobs Hall 310</div>
                      </div>
                    </div>

                    <div className="p-3.5 bg-[#2a1a1c] rounded-lg border border-[#8b3543] space-y-1">
                      <div className="font-bold text-[#fca5a5] font-almendra">Dubberly Attendance & Absence Covenant:</div>
                      <p className="text-[#fed7aa] font-serif leading-relaxed">
                        "Because of the collaborative and participatory nature of this course, more than <strong>2 unexcused absences</strong> will affect your final grade. <strong>Missing more than 3 class meetings will result in failing the course.</strong> If sick or an emergency arises, alert faculty in advance."
                      </p>
                    </div>

                    <div className="p-3.5 bg-[#181a13] rounded-lg border border-[#4a3e2c]">
                      <div className="font-bold text-[#f5d77f] font-almendra mb-1">Critique Continuity:</div>
                      <p className="text-[#a4967a] font-serif leading-relaxed">
                        Students work in pairs to construct feedback graphs and systems maps. When missing studio, partners pin up progress and summarize peer feedback afterwards.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 4. LLM MODEL INVOLVED NODE DETAIL */}
            {selectedNode === 'llm_model' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[#3d3321] pb-3">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-[#d4af37]" />
                    <h3 className="text-base font-bold text-[#f5d77f] font-almendra">
                      Component 4: Alchemical LLM (gemini-3.8-flash)
                    </h3>
                  </div>
                  <span className="text-xs font-medieval bg-[#2e2a1d] text-[#f5d77f] border border-[#6b5534] px-2.5 py-1 rounded">
                    gemini-3.8-flash
                  </span>
                </div>

                <p className="text-xs text-[#c9b998] font-serif leading-relaxed">
                  The generation engine is <strong>gemini-3.8-flash</strong> using the official <code>@google/genai</code> TypeScript SDK on a secure Node.js/Express server proxy at <code>/api/peer/consult</code>.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-[#181a13] rounded border border-[#4a3e2c]">
                    <div className="font-bold text-[#f5d77f] font-almendra mb-1">Architecture</div>
                    <div className="text-[#a4967a] font-serif">Low-latency multimodal foundation model optimized for strict instruction fidelity and reasoning.</div>
                  </div>
                  <div className="p-3 bg-[#181a13] rounded border border-[#4a3e2c]">
                    <div className="font-bold text-[#f5d77f] font-almendra mb-1">Structured Schema</div>
                    <div className="text-[#a4967a] font-serif">Enforces rigorous JSON schema output containing email metadata, paragraph arrays, and policy citations.</div>
                  </div>
                  <div className="p-3 bg-[#181a13] rounded border border-[#4a3e2c]">
                    <div className="font-bold text-[#f5d77f] font-almendra mb-1">Execution Security</div>
                    <div className="text-[#a4967a] font-serif">Zero client-side secrets. The <code>GEMINI_API_KEY</code> is quarantined strictly inside server-side environment variables.</div>
                  </div>
                </div>

                <div className="bg-[#181a13] p-3 rounded border border-[#4a3e2c] text-xs font-mono space-y-1">
                  <div className="text-[#8e8169] font-serif italic">// Official SDK Inscription:</div>
                  <div className="text-[#ffd166]">ai.models.generateContent&#40;&#123;</div>
                  <div className="pl-4 text-[#dcd1b5]">model: "gemini-3.8-flash",</div>
                  <div className="pl-4 text-[#dcd1b5]">contents: systemPrompt,</div>
                  <div className="pl-4 text-[#dcd1b5]">config: &#123; responseMimeType: "application/json", responseSchema: ... &#125;</div>
                  <div className="text-[#ffd166]">&#125;&#41;</div>
                </div>
              </div>
            )}

            {/* 5. OUTPUT NODE DETAIL */}
            {selectedNode === 'output' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[#3d3321] pb-3">
                  <div className="flex items-center gap-2">
                    <Mail className="w-5 h-5 text-[#52b788]" />
                    <h3 className="text-base font-bold text-[#f5d77f] font-almendra">
                      Component 5: The Ready-to-Send Output Missive
                    </h3>
                  </div>
                  <span className="text-xs font-medieval bg-[#1e2d24] text-[#86efac] border border-[#2d6a4f] px-2.5 py-1 rounded">
                    Epistle + Compliance
                  </span>
                </div>

                <p className="text-xs text-[#c9b998] font-serif leading-relaxed">
                  The model generates an email ready to paste into bMail or email client, paired with real syllabus policy citations and compliance checks:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 bg-[#181a13] rounded-lg border border-[#4a3e2c] space-y-2">
                    <div className="font-bold text-[#f5d77f] font-almendra text-sm">Email Draft Anatomy</div>
                    <ul className="list-disc pl-4 space-y-1 text-[#a4967a] text-[11px] font-serif">
                      <li><strong>Subject:</strong> Course number, context heads up, and student name</li>
                      <li><strong>Salutation:</strong> Friendly first-name greeting (e.g. "Hi Hugh,", "Hi Chris,")</li>
                      <li><strong>Body:</strong> Concise context, health privacy, Figma deliverable status</li>
                      <li><strong>Valediction:</strong> "Best," or "Thanks," with personal name</li>
                    </ul>
                  </div>

                  <div className="p-3.5 bg-[#181a13] rounded-lg border border-[#4a3e2c] space-y-2">
                    <div className="font-bold text-[#f5d77f] font-almendra text-sm">Policy Citation & Rule Verification</div>
                    <ul className="list-disc pl-4 space-y-1 text-[#a4967a] text-[11px] font-serif">
                      <li><strong>Policy Citation:</strong> Exact quote from DESINV 202 or DES INV 200 syllabus</li>
                      <li><strong>First-Name Check:</strong> Enforces collegiate studio culture</li>
                      <li><strong>Medical Privacy:</strong> Protects student dignity at high level</li>
                      <li><strong>Partner Handoff:</strong> Reassures instructor about pinup continuity</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 sm:p-4 bg-[#14150f] border-t-2 border-[#544129] flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-[#a4967a] font-serif">
            <CheckCircle2 className="w-4 h-4 text-[#52b788]" />
            <span>Harmonized with MDes studio standards and Fall 2026 course covenants.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gradient-to-b from-[#d4af37] to-[#8b6b23] hover:from-[#f5d77f] hover:to-[#a4812a] text-[#1a170f] text-xs font-bold rounded-md shadow-md transition-all font-medieval tracking-wide"
          >
            Close Scriptorium Codex
          </button>
        </div>

      </div>
    </div>
  );
};
