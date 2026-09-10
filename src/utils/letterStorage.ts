import { LetterData } from '../types';

export const DEFAULT_LETTER: LetterData = {
  id: 'draft-dubberly-absence',
  title: 'Absence note to Hugh (MDes Systems studio)',
  updatedAt: new Date().toISOString(),
  category: 'personal',
  tone: 'warm',
  length: 'concise',
  date: new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }),
  sender: {
    name: 'Yuwen',
    title: 'MDes Graduate Student',
    organization: 'Jacobs Institute for Design Innovation, UC Berkeley',
    address: 'Jacobs Hall, 2530 Ridge Rd\nBerkeley, CA 94720',
    contact: 'yuwen@berkeley.edu',
  },
  recipient: {
    name: 'Hugh',
    title: 'MDes Faculty, DES INV 200 Systems',
    organization: 'Jacobs Institute for Design Innovation / Dubberly Design Office',
    address: 'Jacobs Hall, Room 310\nUniversity of California, Berkeley',
    contact: 'dubberly@berkeley.edu',
  },
  subject: 'DES INV 200: Absence heads up & studio handoff (Yuwen)',
  salutation: 'Hi Hugh,',
  bodyParagraphs: [
    'Wanted to give you a quick heads up that I won’t be able to make it to tomorrow’s Systems studio. I came down with a pretty bad fever and am heading over to the Tang Center to get checked out.',
    'Elena and I are all synced up on our systems map in Figma, so she has everything ready to pin up and present for our critique tomorrow.',
    'I’ll catch up with Elena on the critique feedback once I’m back on my feet. Thanks so much for understanding!',
  ],
  valediction: 'Best,',
  postscript: '',
  style: {
    letterhead: 'modern',
    font: 'inter',
    showHeader: true,
    showDate: true,
    showSubject: true,
    fontSize: 'md',
  },
  toneAssessment: 'Casual, friendly, and accountable studio communication addressing faculty by first name.',
  writingTips: [
    'Addressed casually by first name (Hi Hugh,) per Berkeley MDes studio culture.',
    'Elena is already briefed so team deliverables in Figma are covered during critique.',
  ],
};

const STORAGE_KEY = 'ai_letter_assistant_drafts';

export function loadSavedLetters(): LetterData[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [DEFAULT_LETTER];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return [DEFAULT_LETTER];
  } catch (err) {
    console.error('Failed to load letters from localStorage:', err);
    return [DEFAULT_LETTER];
  }
}

export function saveLettersToStorage(letters: LetterData[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(letters));
  } catch (err) {
    console.error('Failed to save letters to localStorage:', err);
  }
}
