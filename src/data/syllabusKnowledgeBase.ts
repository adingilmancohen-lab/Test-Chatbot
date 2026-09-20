export interface CourseInstructor {
  name: string;
  email: string;
  role: string;
  officeHours?: string;
}

export interface CourseInfo {
  code: string;
  title: string;
  term: string;
  units: number;
  meetingTime: string;
  location: string;
  instructors: CourseInstructor[];
  gsis: CourseInstructor[];
  description: string;
  keyProjects: { name: string; duration: string; description: string }[];
  attendancePolicies: string[];
  submissionPolicies: string[];
}

export const DESINV_202_SYLLABUS: CourseInfo = {
  code: "DESINV 202",
  title: "Technology Design Foundations (TDF)",
  term: "Fall 2026",
  units: 4,
  meetingTime: "Tuesday & Thursday 3:00 - 5:00 PM",
  location: "Jacobs Hall, UC Berkeley",
  instructors: [
    { name: "Chris Myers", email: "chrismyers@berkeley.edu", role: "Instructor", officeHours: "By appointment" },
    { name: "Dr. Sudhu Tewari", email: "stewari@berkeley.edu", role: "Instructor", officeHours: "Thursday 12:00 - 2:00 PM (or by appointment)" },
    { name: "TJ McLeish", email: "tjmcleish@berkeley.edu", role: "Instructor", officeHours: "Schedule via calendar link" },
    { name: "Joris Komen", email: "jdkomen@berkeley.edu", role: "Instructor", officeHours: "Tu/Th 2:00 - 3:00 PM (in person), Fri 11:00 AM - 5:00 PM (Zoom)" },
  ],
  gsis: [
    { name: "Alistair Vizuet", email: "advizuet@berkeley.edu", role: "GSI / TA", officeHours: "Friday 12:00 - 2:00 PM in Jacobs 220" },
    { name: "Sanjana Mugalvalli", email: "sanjana_mugalvalli@berkeley.edu", role: "GSI / TA", officeHours: "Thursday 1:00 - 2:30 PM" },
  ],
  description:
    "Introduces foundational design and technology frameworks across two tracks: Physical Computing (microcontrollers, Arduino/ESP32, sensors, rapid prototyping, digital fabrication) and Computational Design (AI as material, LLMs, machine vision, Unity simulation, digital twins).",
  keyProjects: [
    {
      name: "PhysComp Project 1: Expressive Mechanics",
      duration: "2 weeks",
      description: "Kinetic sculpture combining Arduino, servo control, laser cutting, 3D printing, and machine learning computer vision control.",
    },
    {
      name: "PhysComp Project 2: Ambient Display",
      duration: "3 weeks",
      description: "Subtle display communicating information via form, sound, color, or light using API calls to real-world data.",
    },
    {
      name: "DesComp Project 1: Mini-Me: Building System Behavior",
      duration: "3 weeks",
      description: "Hands-on shop class for LLMs exploring behavior, system cards, bodystorming, GitHub versioning, Vercel deployment, and coding agents.",
    },
    {
      name: "DesComp Digital Charrette: Teachable Machines (Machine Vision)",
      duration: "0.5 week",
      description: "Interactive machine-vision classifier/detector examining model accuracy, limitations, and dataset bias.",
    },
    {
      name: "DesComp Project 3: Digital Twins (Physical to Computation)",
      duration: "3 weeks",
      description: "Interactive digital simulation assembled in Unity testing conditions difficult to observe in the physical world.",
    },
  ],
  attendancePolicies: [
    "Absence Notification: Students must inform instructors/GSIs via the 'Absence & Tardiness Form' on the bCourses homepage before the start of class (or after for emergencies).",
    "2 Unexcused Absences Allowed: You are allowed two unexcused absences during the semester without penalty.",
    "Grade Penalty: Each additional unexcused absence lowers your final grade by two-thirds of a letter (e.g., A- becomes B).",
    "20% Threshold: Missing more than 20% of course meetings for any reason (excused or unexcused) is grounds for automatic course failure and a mandatory meeting with leadership.",
    "Tardiness: 4 tardies equal 1 absence. Missing more than 15 minutes of any portion of a class counts as an absence.",
    "Critiques & Pinups: Missing a pinup/minor milestone results in a '0' for that presentation. Missing a juried critique results in a '0' AND a reduction of one letter grade for the course.",
    "Excused Absences: Illness or injury, religious observance, family emergency, mandatory legal obligations. Health specifics can be kept high-level.",
  ],
  submissionPolicies: [
    "Grace Period: Late assignments submitted within 1 hour of the deadline receive full credit. Beyond this buffer, assignments lose 10% per day.",
    "Extensions: Must be requested at least 24 hours prior to the assignment deadline.",
    "Laptops/Devices: Should remain closed unless actively coding or working on technical builds to avoid secondhand screen distractions.",
  ],
};

export const DESINV_200_SYLLABUS: CourseInfo = {
  code: "DES INV 200",
  title: "Design Frameworks",
  term: "Fall 2026",
  units: 3,
  meetingTime: "Wednesdays 3:30 - 7:00 PM",
  location: "Jacobs Hall, Room 310, UC Berkeley",
  instructors: [
    { name: "Hugh Dubberly", email: "hugh@dubberly.com", role: "Faculty / Course Lead", officeHours: "After class or arranged by email" },
    { name: "Lingxiu Zhang", email: "lingxiuc@berkeley.edu", role: "Faculty / Coordinator", officeHours: "After class or arranged by email" },
    { name: "Eric Rodenbeck", email: "erode@stamen.com", role: "Faculty (Stamen Design)", officeHours: "After class or arranged by email" },
    { name: "Ben Shaw", email: "ben.shaw@mindspring.com", role: "Faculty", officeHours: "After class or arranged by email" },
    { name: "Kevin Ma", email: "kevinma1515@berkeley.edu", role: "Faculty", officeHours: "After class or arranged by email" },
    { name: "John Cain", email: "john@zerowidth.ai", role: "Faculty", officeHours: "After class or arranged by email" },
  ],
  gsis: [],
  description:
    "Seminar course exploring design discourse, mental models, and frameworks. Examines histories of interaction and design theories through weekly readings, concept maps, chalk-talks, lectures, and small-group synthesis exercises.",
  keyProjects: [
    {
      name: "Weekly Reading Concept Maps (Assignment 1)",
      duration: "Weekly (1 reading history + 1 reading theory)",
      description: "2 concept maps per week, 11x17 printed landscape format, brought to class every Wednesday at 3:30 PM.",
    },
    {
      name: "Chalk-Talks on the Readings (Assignment 2)",
      duration: "2 presentations per semester (~5 mins each)",
      description: "Informal whiteboard presentation with no digital slides drawing 5-9 key concepts and connections live to lead section discussion.",
    },
    {
      name: "Final Concept Map Booklet (Assignment 3)",
      duration: "Due December 16",
      description: "11x17 landscape PDF compiling all revised weekly concept maps, frameworks, principles, and paradigms.",
    },
    {
      name: "Chef's Choice Reading & Meta-Map Poster (Assignment 4)",
      duration: "Deliverables Nov 25, Dec 2, Dec 7",
      description: "22x34 poster synthesizing course themes and adding an independently chosen design theory/history paper.",
    },
  ],
  attendancePolicies: [
    "MDes Attendance Policy: 2 unexcused absences permitted without penalty.",
    "Grade Penalty: Each additional unexcused absence lowers course grade by two-thirds of a letter.",
    "Automatic Failure: Missing more than 20% of meetings or missing more than 3 class meetings (4/15 = 26%) results in failing the course.",
    "Notification: If sick, notify faculty in advance. Class begins promptly at 3:30 PM; tardiness and ducking out early affects participation grades.",
    "Devices Policy: Electronics must be shut off, closed, and stowed away off desks during seminar sessions.",
  ],
  submissionPolicies: [
    "Concept Maps Due: Every Wednesday at 3:30 PM printed (printers available in Jacobs Hall 2nd floor and Wurster studio).",
    "The Loom App: Software tool at loom.aroughidea.com for taking notes, tagging concepts, and linking triples into knowledge graphs.",
  ],
};

export const SYLLABUS_KNOWLEDGE_BASE_TEXT = `
=== UC BERKELEY MDES SYLLABUS KNOWLEDGE BASE ===

[COURSE 1: DESINV 202 - Technology Design Foundations (Fall 2026)]
- Instructors: Chris Myers (chrismyers@berkeley.edu), Dr. Sudhu Tewari (stewari@berkeley.edu, OH Th 12-2), TJ McLeish (tjmcleish@berkeley.edu), Joris Komen (jdkomen@berkeley.edu, OH Tu/Th 2-3 in person, Fri 11-5 on Zoom).
- GSIs / TAs: Alistair Vizuet (advizuet@berkeley.edu, OH Fri 12-2 in Jacobs 220), Sanjana Mugalvalli (sanjana_mugalvalli@berkeley.edu, OH Th 1-2:30).
- Format: Lecture + Studio, Tuesdays & Thursdays 3:00-5:00 PM at Jacobs Hall.
- Curriculum: Physical Computing (Arduino, ESP32, sensors, servos, digital fabrication, 3D printing, laser cutting) & Computational Design (LLMs, machine vision, Unity digital twins, simulations).
- Key Projects: Expressive Mechanics (kinetic sculpture), Ambient Display (API-driven subtle output), Mini-Me (LLM system behavior & system cards), Teachable Machines (machine vision charrette), Digital Twins (Unity physical simulation).
- Attendance Policy:
  * Official procedure: Must complete the "Absence & Tardiness Form" on the bCourses homepage before class start.
  * 2 unexcused absences allowed without penalty. Each additional unexcused absence lowers final grade by 2/3 of a letter (e.g. A- to B).
  * Missing >20% of class meetings for any reason is grounds for automatic failure.
  * 4 tardies = 1 absence. Missing >15 minutes = absence.
  * Critiques: Missing pinup / milestone is an automatic 0 for presentation; missing juried critique reduces final course grade by 1 letter.
  * Illness is an excused absence. Students should coordinate with team members so studio deliverables proceed.

[COURSE 2: DES INV 200 - Design Frameworks (Fall 2026)]
- Lead Faculty: Hugh Dubberly (hugh@dubberly.com), Lingxiu Zhang (lingxiuc@berkeley.edu), Eric Rodenbeck (erode@stamen.com), Ben Shaw (ben.shaw@mindspring.com), Kevin Ma (kevinma1515@berkeley.edu), John Cain (john@zerowidth.ai).
- Meeting Time: Wednesdays 3:30 - 7:00 PM in Jacobs Hall, Room 310.
- Hour 1 (3:30-4:30): 5 reading discussion sections (~13 students each) with student chalk-talks (5-9 concepts on whiteboard, no slides, 5 min).
- Hour 2 (4:45-5:45): Full class lecture in Jacobs 310.
- Hour 3 (6:00-7:00): Small group exercise (4-5 students).
- Tools & Work: The Loom App (loom.aroughidea.com) for knowledge graph triples (noun-verb-noun); Weekly 11x17 printed concept maps (2 readings per week); Final Concept Map Booklet (due Dec 16); Final Meta-Map poster (22x34 inches).
- Attendance Policy:
  * 2 unexcused absences permitted. Additional unexcused absences lower grade by 2/3 letter.
  * Missing more than 3 class meetings (4/15 = 26%) or >20% results in failing Frameworks.
  * Must alert faculty in advance if sick.
  * Electronics must remain shut off and stowed off desks.

[CAMPUS RESOURCES & CULTURE]
- Location: Jacobs Hall for Design Innovation, UC Berkeley.
- Health: University Health Services (UHS) / Tang Center. Students should not overshare intimate medical details; brief high-level mention of fever/illness and Tang Center appointment is standard and polite.
- Culture: Professors and students operate on a friendly first-name basis (e.g. Hugh, Chris, Sudhu, Joris, TJ, Alistair). Studio communication prioritizes team continuity (e.g. teammate pinning up work or Figma file link).
`;

export const SYSTEM_INSTRUCTIONS_TEXT = `
You are a trusted peer AI assistant specialized for UC Berkeley Master of Design (MDes) graduate students.

CRITICAL DIRECTIVES:
1. GENERATE AN ACTUAL EMAIL, NOT ADVICE:
Directly compose the complete, ready-to-send email with Subject, Salutation, Body Paragraphs, Valediction, and Sign-off. Never output conversational meta-advice or coaching bullet points on what the user should write.

2. CASUAL TONE & FIRST-NAME BASIS:
MDes faculty (Hugh Dubberly, Chris Myers, Sudhu Tewari, Joris Komen, TJ McLeish, etc.) and GSIs (Alistair Vizuet, Sanjana Mugalvalli) operate in an active, collaborative studio environment in Jacobs Hall.
- Always address instructors by their FIRST NAME ("Hi Hugh,", "Hi Chris,", "Hi Joris,", etc.). NEVER use "Dear Professor", "Dear Dr.", or "Mr./Ms.".
- Maintain a respectful, direct, collegiate, and responsible studio tone.
- Avoid archaic, overly stiff bureaucratic phrasing. Keep it natural, thoughtful, and concise.

3. POLICIES & KNOWLEDGE BASE GROUNDING:
- Reference appropriate course policies from the syllabus (e.g., bCourses Absence & Tardiness Form, 2 unexcused absences allowance, Tang Center visit, Jacobs Hall studio culture, teammate handoff for pinups/critiques).
- No oversharing of sensitive medical details: state the health issue cleanly and at a high level (e.g., "came down with a fever and am heading to the Tang Center").
- Always reassure the instructor regarding deliverables (e.g. mentioning Figma links, partner presenting or pinning up in Jacobs Hall).
- Valediction: "Best," or "Thanks," followed by the student's actual name provided in the user context. Do not assume or hardcode any default name.
`;
