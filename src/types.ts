export type LetterCategory = 
  | 'formal'
  | 'business'
  | 'personal'
  | 'official'
  | 'inquiry'
  | 'recommendation';

export type LetterTone =
  | 'professional'
  | 'warm'
  | 'assertive'
  | 'diplomatic'
  | 'persuasive'
  | 'apologetic'
  | 'cordial'
  | 'formal';

export type LetterLength = 'concise' | 'balanced' | 'comprehensive';

export type LetterheadStyle = 'classic' | 'modern' | 'minimal' | 'executive' | 'linen';

export type LetterFont = 'garamond' | 'newsreader' | 'lora' | 'inter';

export interface PersonDetails {
  name: string;
  title: string;
  organization: string;
  address: string;
  contact: string;
}

export interface LetterStyleConfig {
  letterhead: LetterheadStyle;
  font: LetterFont;
  showHeader: boolean;
  showDate: boolean;
  showSubject: boolean;
  fontSize: 'sm' | 'md' | 'lg';
}

export interface LetterData {
  id: string;
  title: string;
  updatedAt: string;
  category: LetterCategory;
  tone: LetterTone;
  length: LetterLength;
  date: string;
  sender: PersonDetails;
  recipient: PersonDetails;
  subject: string;
  salutation: string;
  bodyParagraphs: string[];
  valediction: string;
  postscript: string;
  style: LetterStyleConfig;
  toneAssessment?: string;
  writingTips?: string[];
}

export interface LetterTemplate {
  id: string;
  name: string;
  category: LetterCategory;
  description: string;
  tone: LetterTone;
  purpose: string;
  keyPoints: string;
  defaultRecipientTitle: string;
  previewSnippet: string;
}

export interface CritiqueResult {
  toneImpression: string;
  politenessScore: number;
  clarityScore: number;
  strengths: string[];
  improvements: string[];
  verdict: string;
}

export type InteractionLoopStep = 1 | 2 | 3 | 4;

export interface GeneratedEmailData {
  recipientName: string;
  recipientEmail: string;
  senderName: string;
  senderEmail: string;
  subject: string;
  salutation: string;
  bodyParagraphs: string[];
  valediction: string;
  postscript?: string;
}

export interface PeerRuleChecks {
  professionalTone: boolean;
  directAccountability: boolean;
  noOverSharing: boolean;
  policyCompliant: boolean;
}

export interface PeerConsultResponse {
  email: GeneratedEmailData;
  policyReference: string;
  nextLoopStep: InteractionLoopStep;
  currentStepName: string;
  ruleChecks?: PeerRuleChecks;
}

export interface PeerInteractionTurn {
  id: string;
  timestamp: string;
  step: InteractionLoopStep;
  stepName: string;
  userAsk: string;
  specificOutput: string;
  additionalInfo: string;
  generatedEmail: GeneratedEmailData;
  policyReference?: string;
  ruleChecks?: PeerRuleChecks;
}

