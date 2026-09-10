import React, { useState } from 'react';
import { 
  X, 
  Bot, 
  User, 
  ArrowRight, 
  Database, 
  ShieldAlert, 
  CheckCircle2, 
  Sparkles, 
  FileText, 
  RotateCcw, 
  Layers, 
  Sliders, 
  Cpu, 
  BookOpen, 
  HelpCircle,
  Clock,
  School
} from 'lucide-react';
import { InteractionLoopStep } from '../types';

interface SystemDiagramModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeLoopStep: InteractionLoopStep;
  onSelectLoopStep?: (step: InteractionLoopStep) => void;
}

type ActiveNodeId = 
  | 'user' 
  | 'agent' 
  | 'guardrails' 
  | 'loop' 
  | 'knowledge' 
  | 'gemini' 
  | 'outputs';

export const SystemDiagramModal: React.FC<SystemDiagramModalProps> = ({
  isOpen,
  onClose,
  activeLoopStep,
  onSelectLoopStep,
}) => {
  const [selectedNode, setSelectedNode] = useState<ActiveNodeId>('agent');

  if (!isOpen) return null;

  const loopSteps = [
    { num: 1, title: 'Provides High-Level Suggestion', desc: 'Gives immediate tactical direction on contacting Hugh Dubberly without filler.' },
    { num: 2, title: 'Asks for Symptoms', desc: 'Inquires about severity to determine if Tang Center documentation is required (max 1 question).' },
    { num: 3, title: 'Clarifies Suggestion', desc: 'Aligns the letter with Dubberly’s systems expectations and Jacobs Hall studio critique policies.' },
    { num: 4, title: 'Provides Alternative', desc: 'Offers backup options (asynchronous critique, teammate peer notes, office hours review).' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/75 backdrop-blur-xs no-print overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-stone-300 w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#003262] text-[#FDB515] flex items-center justify-center font-bold shadow-xs">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-stone-900 font-cinzel">
                  System Architecture & Agent Diagram
                </h2>
                <span className="text-[10px] uppercase tracking-wider font-mono font-semibold bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                  Reliable Peer Agent
                </span>
              </div>
              <p className="text-xs text-stone-500">
                Visualizing data flow, behavioral guardrails, interaction loop, and knowledge integration for UC Berkeley MDes.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Main Area: Top Interactive Canvas, Bottom Details Pane */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-stone-100/50">
          
          {/* Top Flow Diagram Grid */}
          <div className="bg-white p-4 sm:p-6 rounded-xl border border-stone-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-600 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-[#003262]" />
                <span>Interactive Agent Workflow Diagram (Click any node to inspect)</span>
              </span>
              <span className="text-[11px] text-stone-500 font-mono">
                Current Loop Step: <strong className="text-[#003262]">Step {activeLoopStep}</strong>
              </span>
            </div>

            {/* Architecture Node Blocks */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 relative">
              
              {/* 1. User Inputs (Cols 1-3) */}
              <div 
                onClick={() => setSelectedNode('user')}
                className={`md:col-span-3 p-4 rounded-lg border-2 cursor-pointer transition-all flex flex-col justify-between ${
                  selectedNode === 'user' 
                    ? 'border-[#003262] bg-blue-50/50 shadow-sm ring-2 ring-[#003262]/20' 
                    : 'border-stone-200 bg-stone-50 hover:border-stone-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider font-semibold text-stone-500">Input Layer</span>
                    <User className="w-4 h-4 text-stone-700" />
                  </div>
                  <h4 className="text-xs font-bold text-stone-900">Classmate (Yuwen)</h4>
                  <p className="text-[11px] text-stone-600 mt-1">
                    Seeking advice on contacting Hugh Dubberly for serious sickness.
                  </p>
                </div>

                <div className="mt-3 space-y-1 text-[10px] font-mono bg-white p-2 rounded border border-stone-200 text-stone-700">
                  <div className="truncate">• 1. Initial Ask</div>
                  <div className="truncate">• 2. Specific Output</div>
                  <div className="truncate">• 3. Additional Info (Symptoms)</div>
                </div>
              </div>

              {/* Arrow 1 */}
              <div className="hidden md:flex md:col-span-1 items-center justify-center">
                <ArrowRight className="w-5 h-5 text-stone-400" />
              </div>

              {/* 2. Reliable Peer Agent Core (Cols 5-8) */}
              <div 
                onClick={() => setSelectedNode('agent')}
                className={`md:col-span-4 p-4 rounded-lg border-2 cursor-pointer transition-all flex flex-col justify-between ${
                  selectedNode === 'agent' 
                    ? 'border-amber-600 bg-amber-50/50 shadow-sm ring-2 ring-amber-500/20' 
                    : 'border-stone-200 bg-stone-50 hover:border-stone-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider font-semibold text-amber-700">Autonomous Agent</span>
                    <Bot className="w-4 h-4 text-amber-600" />
                  </div>
                  <h4 className="text-xs font-bold text-stone-900">Reliable Peer Agent</h4>
                  <p className="text-[11px] text-stone-600 mt-1">
                    Informational MDes peer; diagnoses situation while staying concise, casual, and respectful.
                  </p>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-1.5 text-[10px]">
                  <button 
                    onClick={(e) => { e.stopPropagation(); setSelectedNode('guardrails'); }}
                    className={`p-1.5 rounded border text-left font-medium transition-colors ${
                      selectedNode === 'guardrails' ? 'bg-rose-100 border-rose-300 text-rose-900' : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    Δ Behavioral Rules
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setSelectedNode('loop'); }}
                    className={`p-1.5 rounded border text-left font-medium transition-colors ${
                      selectedNode === 'loop' ? 'bg-amber-100 border-amber-300 text-amber-900' : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    4-Step Loop
                  </button>
                </div>
              </div>

              {/* Arrow 2 */}
              <div className="hidden md:flex md:col-span-1 items-center justify-center">
                <ArrowRight className="w-5 h-5 text-stone-400" />
              </div>

              {/* 3. Output Delivery (Cols 10-12) */}
              <div 
                onClick={() => setSelectedNode('outputs')}
                className={`md:col-span-3 p-4 rounded-lg border-2 cursor-pointer transition-all flex flex-col justify-between ${
                  selectedNode === 'outputs' 
                    ? 'border-emerald-600 bg-emerald-50/50 shadow-sm ring-2 ring-emerald-500/20' 
                    : 'border-stone-200 bg-stone-50 hover:border-stone-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider font-semibold text-emerald-700">Dual Output Layer</span>
                    <FileText className="w-4 h-4 text-emerald-600" />
                  </div>
                  <h4 className="text-xs font-bold text-stone-900">Delivery & Canvas</h4>
                  <p className="text-[11px] text-stone-600 mt-1">
                    Structured response addressing user ask in order, with live letter canvas.
                  </p>
                </div>

                <div className="mt-3 space-y-1 text-[10px] font-mono bg-white p-2 rounded border border-stone-200 text-stone-700">
                  <div className="truncate">✓ 1. Complete Email Draft</div>
                  <div className="truncate">✓ 2. Live Letter & bMail Canvas</div>
                  <div className="truncate">✓ 3. Berkeley Policy Check</div>
                </div>
              </div>

            </div>

            {/* Bottom Supporting Services: Knowledge Base & LLM Engine */}
            <div className="mt-4 pt-4 border-t border-stone-200 grid grid-cols-1 md:grid-cols-2 gap-3.5">
              
              {/* Knowledge Base */}
              <div 
                onClick={() => setSelectedNode('knowledge')}
                className={`p-3.5 rounded-lg border-2 cursor-pointer transition-all flex items-start gap-3 ${
                  selectedNode === 'knowledge' 
                    ? 'border-[#003262] bg-blue-50/60 ring-2 ring-[#003262]/20' 
                    : 'border-stone-200 bg-stone-50 hover:border-stone-300'
                }`}
              >
                <div className="w-8 h-8 rounded bg-[#003262] text-[#FDB515] flex items-center justify-center shrink-0">
                  <School className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-stone-900">UC Berkeley MDes Knowledge Base</h5>
                  <p className="text-[11px] text-stone-600 mt-0.5">
                    Profiles Professor Hugh Dubberly (Systems expectations), Jacobs Hall studio critique protocols, and Tang Center UHS absence regulations.
                  </p>
                </div>
              </div>

              {/* Gemini 3.8 Flash Engine */}
              <div 
                onClick={() => setSelectedNode('gemini')}
                className={`p-3.5 rounded-lg border-2 cursor-pointer transition-all flex items-start gap-3 ${
                  selectedNode === 'gemini' 
                    ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20' 
                    : 'border-stone-200 bg-stone-50 hover:border-stone-300'
                }`}
              >
                <div className="w-8 h-8 rounded bg-indigo-600 text-white flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-stone-900">Inference Engine (Gemini 3.8 Flash)</h5>
                  <p className="text-[11px] text-stone-600 mt-0.5">
                    Server-side structured generation enforcing JSON response schema and real-time rule compliance audits.
                  </p>
                </div>
              </div>

            </div>

          </div>

          {/* Interactive State / Node Inspection Inspector */}
          <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs">
            {selectedNode === 'agent' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Bot className="w-5 h-5 text-amber-600" />
                  <h3 className="text-sm font-bold text-stone-900 font-cinzel">
                    Agent Specification: Role Name "Reliable Peer"
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="bg-stone-50 p-3.5 rounded-lg border border-stone-200 space-y-2">
                    <span className="font-semibold text-stone-800 uppercase tracking-wider text-[11px] block">
                      Core Mission & Persona
                    </span>
                    <p className="text-stone-700 leading-relaxed">
                      <strong>Purpose:</strong> To help classmates with school-related questions, specifically pertaining to relationships with professors and access to school resources. Informational and not conversational.
                    </p>
                    <p className="text-stone-700 leading-relaxed">
                      <strong>Engagement Context:</strong> The friend (Yuwen) is seeking advice on how to write a letter to Hugh Dubberly about missing class due to serious sickness.
                    </p>
                  </div>

                  <div className="bg-stone-50 p-3.5 rounded-lg border border-stone-200 space-y-2">
                    <span className="font-semibold text-stone-800 uppercase tracking-wider text-[11px] block">
                      Boundaries & Non-Goals
                    </span>
                    <ul className="space-y-1 text-stone-700">
                      <li>• A respectful peer without pushing for personal details or assuming feelings.</li>
                      <li>• Only responds in accordance to school policy (Tang Center & Jacobs Hall).</li>
                      <li>• Does not overly sympathize (no emotional platitudes).</li>
                      <li>• Does not fabricate information or encourage disrespectful conduct.</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {selectedNode === 'guardrails' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-rose-600" />
                  <h3 className="text-sm font-bold text-stone-900 font-cinzel">
                    Behavioral Rules Δ & Prompt Guardrails
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                  
                  <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                    <span className="font-bold text-stone-900 block mb-1">Single Short Paragraph</span>
                    <p className="text-stone-600 text-[11px]">
                      The peer only responds in a single short paragraph (max 3-4 sentences). Never multi-paragraph essays.
                    </p>
                  </div>

                  <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                    <span className="font-bold text-stone-900 block mb-1">No Addressing by Name Δ</span>
                    <p className="text-stone-600 text-[11px]">
                      Do not address anyone by name (e.g. no "Hey Yuwen") to keep an authentic casual peer conversational tone.
                    </p>
                  </div>

                  <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                    <span className="font-bold text-stone-900 block mb-1">Opinion Phrasing</span>
                    <p className="text-stone-600 text-[11px]">
                      Make statements as an opinion, strictly using "I think", "I would", or "I know".
                    </p>
                  </div>

                  <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                    <span className="font-bold text-stone-900 block mb-1">Max 1 Question Limit Δ</span>
                    <p className="text-stone-600 text-[11px]">
                      Do not ask more than 1 question in one response. Follow-up questioning is constrained.
                    </p>
                  </div>

                  <div className="p-3 bg-rose-50 rounded-lg border border-rose-200">
                    <span className="font-bold text-rose-900 block mb-1">Banned: "it's usually best" Δ</span>
                    <p className="text-rose-800 text-[11px]">
                      Never use the phrase "it's usually best" because it sounds preachy.
                    </p>
                  </div>

                  <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                    <span className="font-bold text-stone-900 block mb-1">No Excessive Sympathy</span>
                    <p className="text-stone-600 text-[11px]">
                      Avoid emotional over-sympathizing ("I'm so sorry, recover soon!"). Focus on respectful pragmatic guidance.
                    </p>
                  </div>

                </div>
              </div>
            )}

            {selectedNode === 'loop' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <RotateCcw className="w-5 h-5 text-amber-600" />
                    <h3 className="text-sm font-bold text-stone-900 font-cinzel">
                      Interaction Loop State Machine
                    </h3>
                  </div>
                  <span className="text-xs text-stone-500">
                    Click a step below to view or jump simulation:
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {loopSteps.map((s) => {
                    const isCurrent = s.num === activeLoopStep;
                    return (
                      <div
                        key={s.num}
                        onClick={() => onSelectLoopStep && onSelectLoopStep(s.num as InteractionLoopStep)}
                        className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                          isCurrent
                            ? 'border-[#003262] bg-blue-50/70 shadow-xs ring-2 ring-[#003262]/20'
                            : 'border-stone-200 bg-white hover:border-stone-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-500">
                            State {s.num}
                          </span>
                          {isCurrent && (
                            <span className="text-[10px] font-bold bg-[#003262] text-[#FDB515] px-1.5 py-0.2 rounded font-mono">
                              ACTIVE
                            </span>
                          )}
                        </div>
                        <h4 className="text-xs font-bold text-stone-900 mb-1">{s.title}</h4>
                        <p className="text-[11px] text-stone-600 leading-normal">{s.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {selectedNode === 'knowledge' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <School className="w-5 h-5 text-[#003262]" />
                  <h3 className="text-sm font-bold text-stone-900 font-cinzel">
                    UC Berkeley MDes Knowledge Base
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-lg border border-stone-200 bg-stone-50 space-y-2">
                    <span className="font-bold text-stone-900 block text-xs">
                      Character Knowledge: Professor Hugh Dubberly
                    </span>
                    <p className="text-stone-700 leading-relaxed">
                      Hugh Dubberly is a renowned design planner and systems thinker, founder of Dubberly Design Office, and faculty in the UC Berkeley Master of Design (MDes) program.
                    </p>
                    <p className="text-stone-700 leading-relaxed">
                      <strong>Communication Style:</strong> Prefers clear, structured, systems-oriented communication. Dislikes vague excuses; respects direct acknowledgment of constraints, clear plans for deliverables, and early notification before class begins.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-lg border border-stone-200 bg-stone-50 space-y-2">
                    <span className="font-bold text-stone-900 block text-xs">
                      Context & School Resources: UC Berkeley MDes
                    </span>
                    <p className="text-stone-700 leading-relaxed">
                      <strong>Jacobs Hall 310:</strong> Home of MDes studios and critique sessions. Absences directly impact cohort partners during collaborative critique rounds.
                    </p>
                    <p className="text-stone-700 leading-relaxed">
                      <strong>Tang Center (UHS):</strong> University Health Services handles medical appointments. Official medical excuses are only provided for serious conditions under Academic Senate guidelines.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {selectedNode === 'user' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-stone-700" />
                  <h3 className="text-sm font-bold text-stone-900 font-cinzel">
                    Required Inputs Specification
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                    <span className="font-bold text-stone-900 block mb-1">1. Initial Ask</span>
                    <p className="text-stone-600 text-[11px]">
                      The core question or dilemma (e.g. "How should I email Hugh Dubberly about missing class because I'm seriously sick?").
                    </p>
                  </div>
                  <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                    <span className="font-bold text-stone-900 block mb-1">2. Specific Output</span>
                    <p className="text-stone-600 text-[11px]">
                      What the classmate expects (e.g. an email draft, a checklist of policy steps, or an alternative critique plan).
                    </p>
                  </div>
                  <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                    <span className="font-bold text-stone-900 block mb-1">3. Additional Information</span>
                    <p className="text-stone-600 text-[11px]">
                      Contextual details such as symptoms, Tang Center visits, or upcoming systems studio deliverables.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {selectedNode === 'outputs' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-sm font-bold text-stone-900 font-cinzel">
                    Organized Feedback Structure & Dual Output
                  </h3>
                </div>
                <p className="text-xs text-stone-600">
                  The Reliable Peer returns an organized feedback structure that directly responds to the user's request in order of how the question was phrased:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-emerald-50/60 rounded-lg border border-emerald-200 space-y-1">
                    <span className="font-bold text-emerald-900 block">1. Complete Ready-to-Send Email</span>
                    <p className="text-stone-700 text-[11px]">
                      A fully written, casual studio email addressed to Hugh by first name with appropriate subject line, salutation (&quot;Hi Hugh,&quot;), accountable body paragraphs, and friendly sign-off (&quot;Best, Yuwen&quot;) — no lecturing.
                    </p>
                  </div>
                  <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 space-y-1">
                    <span className="font-bold text-stone-900 block">2. Live Letter & bMail Canvas</span>
                    <p className="text-stone-700 text-[11px]">
                      Automatically syncs to the interactive canvas with 1-click clipboard copy, mail client launch (mailto:), and formatting options.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {selectedNode === 'gemini' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-sm font-bold text-stone-900 font-cinzel">
                    Inference Engine (Gemini 3.8 Flash)
                  </h3>
                </div>
                <p className="text-xs text-stone-700 leading-relaxed">
                  The app calls Google Gen AI SDK on the Express backend (<code className="bg-stone-100 px-1 py-0.5 rounded font-mono text-[11px]">/api/peer/consult</code>) with a strict JSON response schema. This guarantees that every generation simultaneously fulfills the single-paragraph constraint, opinion phrasing requirements, Berkeley policy checks, and letter canvas updates.
                </p>
              </div>
            )}

          </div>

        </div>

        {/* Footer */}
        <div className="p-3.5 sm:p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-stone-500 font-mono">
            <span>UC Berkeley MDes</span>
            <span>•</span>
            <span>Reliable Peer System Diagram v1.2</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#003262] hover:bg-[#002549] text-white text-xs font-semibold rounded-md transition-colors"
          >
            Close Diagram
          </button>
        </div>

      </div>
    </div>
  );
};
