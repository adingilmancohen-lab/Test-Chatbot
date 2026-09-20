import React, { useState } from 'react';
import { 
  X, 
  User, 
  ArrowRight, 
  Database, 
  ShieldCheck, 
  Cpu, 
  BookOpen, 
  Mail,
  FileCode2,
  School,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { 
  DESINV_202_SYLLABUS, 
  DESINV_200_SYLLABUS, 
  SYSTEM_INSTRUCTIONS_TEXT 
} from '../data/syllabusKnowledgeBase';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/75 backdrop-blur-xs no-print overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-stone-300 w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 bg-[#002549] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#003262] text-[#FDB515] border border-[#FDB515]/30 flex items-center justify-center font-bold shadow-xs">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white font-cinzel">
                  System Architecture Diagram
                </h2>
                <span className="text-[10px] uppercase tracking-wider font-mono font-semibold bg-[#FDB515] text-[#002549] px-2 py-0.5 rounded">
                  Reliable Peer
                </span>
              </div>
              <p className="text-xs text-blue-200/80">
                End-to-end pipeline: Input ➔ Instructions & Syllabus Knowledge Base ➔ LLM Model ➔ Ready-to-Send Output.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-300 hover:text-white hover:bg-[#003262] rounded-md transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-stone-50">
          
          {/* Top Pipeline Flow Bar */}
          <div className="bg-white p-4 sm:p-5 rounded-xl border border-stone-200 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-600 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#003262]" />
                <span>Select any node below to inspect details:</span>
              </span>
              <span className="text-[11px] text-stone-500 font-mono">
                Click a component to view its specs & content
              </span>
            </div>

            {/* 5-Node Flow Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5 relative">
              
              {/* 1. Input */}
              <button
                onClick={() => setSelectedNode('input')}
                className={`p-3 rounded-lg border-2 text-left transition-all flex flex-col justify-between ${
                  selectedNode === 'input'
                    ? 'border-[#003262] bg-blue-50/60 shadow-sm ring-2 ring-[#003262]/20'
                    : 'border-stone-200 bg-stone-50 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold text-stone-800">
                  <span>1. Input</span>
                  <User className="w-4 h-4 text-stone-600" />
                </div>
                <div className="mt-2 text-[11px] text-stone-600">
                  Single User Prompt
                </div>
                <div className="mt-2 text-[10px] font-mono text-stone-500 truncate bg-white p-1.5 rounded border border-stone-200">
                  {currentPrompt ? `"${currentPrompt.slice(0, 30)}..."` : 'Student ask'}
                </div>
              </button>

              {/* 2. System Instructions */}
              <button
                onClick={() => setSelectedNode('system_instructions')}
                className={`p-3 rounded-lg border-2 text-left transition-all flex flex-col justify-between ${
                  selectedNode === 'system_instructions'
                    ? 'border-[#003262] bg-blue-50/60 shadow-sm ring-2 ring-[#003262]/20'
                    : 'border-stone-200 bg-stone-50 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold text-stone-800">
                  <span>2. Instructions</span>
                  <FileCode2 className="w-4 h-4 text-stone-600" />
                </div>
                <div className="mt-2 text-[11px] text-stone-600">
                  MDes Directives
                </div>
                <div className="mt-2 text-[10px] font-mono text-stone-500 truncate bg-white p-1.5 rounded border border-stone-200">
                  Casual • First-name
                </div>
              </button>

              {/* 3. Knowledge Base */}
              <button
                onClick={() => setSelectedNode('knowledge_base')}
                className={`p-3 rounded-lg border-2 text-left transition-all flex flex-col justify-between ${
                  selectedNode === 'knowledge_base'
                    ? 'border-[#003262] bg-amber-50/60 shadow-sm ring-2 ring-amber-500/20'
                    : 'border-stone-200 bg-stone-50 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold text-stone-800">
                  <span>3. Knowledge Base</span>
                  <BookOpen className="w-4 h-4 text-amber-700" />
                </div>
                <div className="mt-2 text-[11px] text-stone-600 font-medium">
                  Course Syllabi
                </div>
                <div className="mt-2 text-[10px] font-mono text-amber-900 truncate bg-white p-1.5 rounded border border-amber-200">
                  DESINV 202 & 200
                </div>
              </button>

              {/* 4. LLM Model Involved */}
              <button
                onClick={() => setSelectedNode('llm_model')}
                className={`p-3 rounded-lg border-2 text-left transition-all flex flex-col justify-between ${
                  selectedNode === 'llm_model'
                    ? 'border-[#003262] bg-blue-50/60 shadow-sm ring-2 ring-[#003262]/20'
                    : 'border-stone-200 bg-stone-50 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold text-stone-800">
                  <span>4. LLM Model</span>
                  <Cpu className="w-4 h-4 text-stone-600" />
                </div>
                <div className="mt-2 text-[11px] text-stone-600">
                  gemini-3.8-flash
                </div>
                <div className="mt-2 text-[10px] font-mono text-stone-500 truncate bg-white p-1.5 rounded border border-stone-200">
                  Structured JSON
                </div>
              </button>

              {/* 5. Output */}
              <button
                onClick={() => setSelectedNode('output')}
                className={`p-3 rounded-lg border-2 text-left transition-all flex flex-col justify-between ${
                  selectedNode === 'output'
                    ? 'border-[#003262] bg-emerald-50/60 shadow-sm ring-2 ring-emerald-500/20'
                    : 'border-stone-200 bg-stone-50 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold text-stone-800">
                  <span>5. Output</span>
                  <Mail className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="mt-2 text-[11px] text-stone-600">
                  Ready-to-Send
                </div>
                <div className="mt-2 text-[10px] font-mono text-stone-500 truncate bg-white p-1.5 rounded border border-stone-200">
                  Email + Policies
                </div>
              </button>

            </div>
          </div>

          {/* Bottom Detailed Inspection Pane */}
          <div className="bg-white p-5 sm:p-6 rounded-xl border border-stone-200 shadow-xs">
            
            {/* 1. INPUT NODE DETAIL */}
            {selectedNode === 'input' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5 text-[#003262]" />
                    <h3 className="text-sm font-bold text-stone-900 font-cinzel">
                      Component 1: Single User Input
                    </h3>
                  </div>
                  <span className="text-xs font-mono bg-blue-100 text-[#003262] px-2.5 py-1 rounded">
                    User Interface
                  </span>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed">
                  Instead of complex questionnaires, the user specifies their name (currently <strong>"{userName}"</strong>) and types what they need into the prompt box. They can also provide feedback to iteratively revise any generated draft.
                </p>

                <div className="bg-stone-50 p-4 rounded-lg border border-stone-200 space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-stone-700">
                    <span>Currently Entered User Prompt:</span>
                    <span className="font-mono text-stone-500 text-[11px]">Sender: {userName}</span>
                  </div>
                  <div className="p-3 bg-white rounded border border-stone-200 text-xs font-mono text-stone-800 whitespace-pre-wrap">
                    {currentPrompt || '(No prompt entered yet. Try typing a request into the main text box.)'}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs">
                  <div className="p-3 bg-stone-50 rounded border border-stone-200">
                    <div className="font-semibold text-stone-800 mb-1">User Identity & Name</div>
                    <div className="text-stone-600">Personalized sender name ({userName}) so the email signature and sign-off adapt to any student.</div>
                  </div>
                  <div className="p-3 bg-stone-50 rounded border border-stone-200">
                    <div className="font-semibold text-stone-800 mb-1">Interactive Revisions</div>
                    <div className="text-stone-600">Type specific revision feedback (e.g. "make it shorter", "mention partner") to refine the draft.</div>
                  </div>
                  <div className="p-3 bg-stone-50 rounded border border-stone-200">
                    <div className="font-semibold text-stone-800 mb-1">Recipient Grounding</div>
                    <div className="text-stone-600">Automatically routes and addresses faculty (Hugh, Chris, Sudhu, Joris, TJ, Alistair) on a first-name basis.</div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. SYSTEM INSTRUCTIONS NODE DETAIL */}
            {selectedNode === 'system_instructions' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                  <div className="flex items-center gap-2">
                    <FileCode2 className="w-5 h-5 text-[#003262]" />
                    <h3 className="text-sm font-bold text-stone-900 font-cinzel">
                      Component 2: System Instructions
                    </h3>
                  </div>
                  <span className="text-xs font-mono bg-blue-100 text-[#003262] px-2.5 py-1 rounded">
                    Persona & Guardrails
                  </span>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed">
                  The system instructions encode the exact collegiate studio norms of UC Berkeley’s Master of Design (MDes) program, ensuring the model never sounds like an impersonal corporate chatbot or over-formal bureaucrat.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  <div className="p-3.5 bg-blue-50/50 rounded-lg border border-blue-100 space-y-1.5">
                    <div className="text-xs font-bold text-[#003262]">Direct Email Generation (No Advice)</div>
                    <p className="text-xs text-stone-600">
                      The model is strictly forbidden from outputting conversational meta-advice or coaching tips. It directly crafts the actual email ready to send.
                    </p>
                  </div>
                  <div className="p-3.5 bg-blue-50/50 rounded-lg border border-blue-100 space-y-1.5">
                    <div className="text-xs font-bold text-[#003262]">Casual First-Name Basis</div>
                    <p className="text-xs text-stone-600">
                      Instructors in Jacobs Hall are addressed by their first name ("Hi Hugh,", "Hi Chris,", "Hi Joris,"). Stiff formulas like "Dear Professor" are eliminated.
                    </p>
                  </div>
                  <div className="p-3.5 bg-blue-50/50 rounded-lg border border-blue-100 space-y-1.5">
                    <div className="text-xs font-bold text-[#003262]">Medical Privacy (No Oversharing)</div>
                    <p className="text-xs text-stone-600">
                      Keeps health notifications respectful and high-level (e.g. fever/flu and Tang Center appointment), avoiding graphic or awkward oversharing.
                    </p>
                  </div>
                  <div className="p-3.5 bg-blue-50/50 rounded-lg border border-blue-100 space-y-1.5">
                    <div className="text-xs font-bold text-[#003262]">Studio Continuity & Handoff</div>
                    <p className="text-xs text-stone-600">
                      Reassures faculty that project deliverables are intact (e.g., links in Figma/Drive, partner presenting in pinup, catching up asynchronously).
                    </p>
                  </div>
                </div>

                <div className="bg-stone-900 text-stone-100 p-3.5 rounded-lg text-[11px] font-mono overflow-x-auto max-h-48">
                  <div className="text-amber-400 font-bold mb-1">// Active System Instructions String:</div>
                  <pre className="whitespace-pre-wrap font-mono text-stone-300">{SYSTEM_INSTRUCTIONS_TEXT.trim()}</pre>
                </div>
              </div>
            )}

            {/* 3. KNOWLEDGE BASE NODE DETAIL */}
            {selectedNode === 'knowledge_base' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-amber-700" />
                    <h3 className="text-sm font-bold text-stone-900 font-cinzel">
                      Component 3: Attached Course Syllabi Knowledge Base
                    </h3>
                  </div>
                  <span className="text-xs font-mono bg-amber-100 text-amber-900 px-2.5 py-1 rounded font-semibold">
                    Ground Truth Data
                  </span>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed">
                  Both attached course syllabi have been synthesized and embedded directly into the model’s context window. The assistant references real instructors, office hours, rooms, attendance thresholds, and assignment requirements.
                </p>

                {/* Course Switcher Tabs */}
                <div className="flex border-b border-stone-200 gap-2">
                  <button
                    onClick={() => setActiveSyllabusTab('desinv202')}
                    className={`pb-2 px-3 text-xs font-bold border-b-2 transition-colors ${
                      activeSyllabusTab === 'desinv202'
                        ? 'border-[#003262] text-[#003262]'
                        : 'border-transparent text-stone-500 hover:text-stone-800'
                    }`}
                  >
                    DESINV 202: Tech Design Foundations
                  </button>
                  <button
                    onClick={() => setActiveSyllabusTab('desinv200')}
                    className={`pb-2 px-3 text-xs font-bold border-b-2 transition-colors ${
                      activeSyllabusTab === 'desinv200'
                        ? 'border-[#003262] text-[#003262]'
                        : 'border-transparent text-stone-500 hover:text-stone-800'
                    }`}
                  >
                    DES INV 200: Design Frameworks
                  </button>
                </div>

                {activeSyllabusTab === 'desinv202' ? (
                  <div className="space-y-3 text-xs">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="p-3 bg-stone-50 rounded border border-stone-200">
                        <span className="font-bold text-stone-800 block mb-1">Instructors & Staff</span>
                        <ul className="space-y-1 text-stone-600">
                          {DESINV_202_SYLLABUS.instructors.map((ins, idx) => (
                            <li key={idx}><strong>{ins.name}</strong> ({ins.email}) - {ins.officeHours}</li>
                          ))}
                          {DESINV_202_SYLLABUS.gsis.map((gsi, idx) => (
                            <li key={idx} className="text-stone-500">GSI: {gsi.name} ({gsi.email}) - {gsi.officeHours}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-3 bg-stone-50 rounded border border-stone-200">
                        <span className="font-bold text-stone-800 block mb-1">Schedule & Location</span>
                        <div className="text-stone-600">
                          {DESINV_202_SYLLABUS.meetingTime} • {DESINV_202_SYLLABUS.location} ({DESINV_202_SYLLABUS.units} Units)
                        </div>
                        <div className="mt-2 text-stone-500">
                          Tracks: Physical Computing (microcontrollers, digital fabrication) & Computational Design (LLMs, vision, simulation).
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-amber-50/60 rounded border border-amber-200">
                      <span className="font-bold text-amber-900 block mb-1.5">Official Attendance & Absence Policies:</span>
                      <ul className="list-disc pl-4 space-y-1 text-stone-700">
                        {DESINV_202_SYLLABUS.attendancePolicies.map((pol, idx) => (
                          <li key={idx}>{pol}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3 bg-stone-50 rounded border border-stone-200">
                      <span className="font-bold text-stone-800 block mb-1">Core Projects:</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-stone-600">
                        {DESINV_202_SYLLABUS.keyProjects.map((proj, idx) => (
                          <div key={idx} className="bg-white p-2 rounded border border-stone-200">
                            <strong>{proj.name}</strong> ({proj.duration}): {proj.description}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 text-xs">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="p-3 bg-stone-50 rounded border border-stone-200">
                        <span className="font-bold text-stone-800 block mb-1">Faculty & Section Leaders</span>
                        <ul className="space-y-1 text-stone-600">
                          {DESINV_200_SYLLABUS.instructors.map((ins, idx) => (
                            <li key={idx}><strong>{ins.name}</strong> ({ins.email}) - {ins.role}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-3 bg-stone-50 rounded border border-stone-200">
                        <span className="font-bold text-stone-800 block mb-1">Course Timing & Setup</span>
                        <div className="text-stone-600">
                          {DESINV_200_SYLLABUS.meetingTime} • {DESINV_200_SYLLABUS.location}
                        </div>
                        <div className="mt-2 text-stone-500">
                          Structure: Hour 1 (Small section reading discussions + student chalk-talks), Hour 2 (Full lecture in Jacobs 310), Hour 3 (In-class exercise).
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-amber-50/60 rounded border border-amber-200">
                      <span className="font-bold text-amber-900 block mb-1.5">Official MDes Attendance & Frameworks Policy:</span>
                      <ul className="list-disc pl-4 space-y-1 text-stone-700">
                        {DESINV_200_SYLLABUS.attendancePolicies.map((pol, idx) => (
                          <li key={idx}>{pol}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3 bg-stone-50 rounded border border-stone-200">
                      <span className="font-bold text-stone-800 block mb-1">Assignments & Deliverables:</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-stone-600">
                        {DESINV_200_SYLLABUS.keyProjects.map((proj, idx) => (
                          <div key={idx} className="bg-white p-2 rounded border border-stone-200">
                            <strong>{proj.name}</strong>: {proj.description}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 4. LLM MODEL INVOLVED NODE DETAIL */}
            {selectedNode === 'llm_model' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-[#003262]" />
                    <h3 className="text-sm font-bold text-stone-900 font-cinzel">
                      Component 4: LLM Model Involved
                    </h3>
                  </div>
                  <span className="text-xs font-mono bg-blue-100 text-[#003262] px-2.5 py-1 rounded font-bold">
                    gemini-3.8-flash
                  </span>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed">
                  The model executing generation is <strong>gemini-3.8-flash</strong> using the official <code>@google/genai</code> SDK on a secure Node.js/Express server. All API keys remain strictly server-side.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-stone-50 rounded border border-stone-200">
                    <div className="font-semibold text-stone-800 mb-1">Architecture</div>
                    <div className="text-stone-600">Gemini Flash model optimized for multimodal reasoning, instant text turnaround, and strict instruction following.</div>
                  </div>
                  <div className="p-3 bg-stone-50 rounded border border-stone-200">
                    <div className="font-semibold text-stone-800 mb-1">Structured Schema</div>
                    <div className="text-stone-600">Returns validated JSON directly conforming to the <code>GeneratedEmailData</code> schema without markdown formatting blocks.</div>
                  </div>
                  <div className="p-3 bg-stone-50 rounded border border-stone-200">
                    <div className="font-semibold text-stone-800 mb-1">Execution Security</div>
                    <div className="text-stone-600">Server-side proxy at <code>/api/peer/consult</code> guarantees <code>GEMINI_API_KEY</code> is never exposed to the client.</div>
                  </div>
                </div>

                <div className="bg-stone-50 p-3 rounded border border-stone-200 text-xs font-mono space-y-1">
                  <div className="text-stone-500">// SDK Call Specification:</div>
                  <div className="text-stone-800">ai.models.generateContent&#40;&#123;</div>
                  <div className="pl-4 text-stone-700">model: "gemini-3.8-flash",</div>
                  <div className="pl-4 text-stone-700">responseMimeType: "application/json",</div>
                  <div className="pl-4 text-stone-700">responseSchema: Type.OBJECT &#123; email, policyReference, ruleChecks &#125;</div>
                  <div className="text-stone-800">&#125;&#41;;</div>
                </div>
              </div>
            )}

            {/* 5. OUTPUT NODE DETAIL */}
            {selectedNode === 'output' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                  <div className="flex items-center gap-2">
                    <Mail className="w-5 h-5 text-emerald-600" />
                    <h3 className="text-sm font-bold text-stone-900 font-cinzel">
                      Component 5: Output Layer
                    </h3>
                  </div>
                  <span className="text-xs font-mono bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded font-bold">
                    Email Letter + Compliance
                  </span>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed">
                  The model generates an email ready to paste into bMail / email client, paired with real syllabus policy citations and compliance checks:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-stone-50 rounded border border-stone-200 space-y-2">
                    <div className="font-bold text-stone-800">Email Draft Structure</div>
                    <ul className="list-disc pl-4 space-y-1 text-stone-600 text-[11px]">
                      <li><strong>Subject:</strong> Direct, context-rich subject line</li>
                      <li><strong>To / From:</strong> Verified Berkeley email addresses</li>
                      <li><strong>Salutation:</strong> Friendly first-name greeting</li>
                      <li><strong>Body:</strong> Concise explanation, deliverable continuity</li>
                      <li><strong>Valediction:</strong> "Best," or "Thanks," with sender name</li>
                    </ul>
                  </div>

                  <div className="p-3 bg-stone-50 rounded border border-stone-200 space-y-2">
                    <div className="font-bold text-stone-800">Policy Citation & Verification</div>
                    <ul className="list-disc pl-4 space-y-1 text-stone-600 text-[11px]">
                      <li><strong>Policy Snippet:</strong> Cites syllabus rule (e.g., bCourses form, 2 unexcused absences)</li>
                      <li><strong>Casual Tone:</strong> Checks against over-formal language</li>
                      <li><strong>Privacy Check:</strong> Confirms no gross medical oversharing</li>
                      <li><strong>Accountability:</strong> Confirms deliverable handoff stated</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 sm:p-4 bg-stone-100 border-t border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-stone-600">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Fully compliant with MDes studio standards and Fall 2026 course syllabi.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#003262] hover:bg-[#002549] text-white text-xs font-semibold rounded-md shadow-xs transition-colors"
          >
            Close Diagram
          </button>
        </div>

      </div>
    </div>
  );
};
