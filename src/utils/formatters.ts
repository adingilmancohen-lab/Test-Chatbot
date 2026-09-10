import { LetterData } from '../types';

export function letterToPlainText(letter: LetterData): string {
  const parts: string[] = [];

  // Sender Header
  if (letter.style.showHeader) {
    const senderParts: string[] = [];
    if (letter.sender.name) senderParts.push(letter.sender.name);
    if (letter.sender.title) senderParts.push(letter.sender.title);
    if (letter.sender.organization) senderParts.push(letter.sender.organization);
    if (letter.sender.address) senderParts.push(letter.sender.address);
    if (letter.sender.contact) senderParts.push(letter.sender.contact);
    if (senderParts.length > 0) {
      parts.push(senderParts.join('\n'));
      parts.push(''); // blank line
    }
  }

  // Date
  if (letter.style.showDate && letter.date) {
    parts.push(letter.date);
    parts.push('');
  }

  // Recipient
  const recipientParts: string[] = [];
  if (letter.recipient.name) recipientParts.push(letter.recipient.name);
  if (letter.recipient.title) recipientParts.push(letter.recipient.title);
  if (letter.recipient.organization) recipientParts.push(letter.recipient.organization);
  if (letter.recipient.address) recipientParts.push(letter.recipient.address);
  if (recipientParts.length > 0) {
    parts.push(recipientParts.join('\n'));
    parts.push('');
  }

  // Subject
  if (letter.style.showSubject && letter.subject) {
    parts.push(`RE: ${letter.subject}`);
    parts.push('');
  }

  // Salutation
  if (letter.salutation) {
    parts.push(letter.salutation);
    parts.push('');
  }

  // Body
  for (const para of letter.bodyParagraphs) {
    if (para.trim()) {
      parts.push(para.trim());
      parts.push('');
    }
  }

  // Valediction & Sender
  if (letter.valediction) {
    parts.push(letter.valediction);
    parts.push('');
    if (letter.sender.name) {
      parts.push(letter.sender.name);
    }
    if (letter.sender.title) {
      parts.push(letter.sender.title);
    }
  }

  // Postscript
  if (letter.postscript && letter.postscript.trim()) {
    parts.push('');
    parts.push(letter.postscript.trim().startsWith('P.S.') ? letter.postscript.trim() : `P.S. ${letter.postscript.trim()}`);
  }

  return parts.join('\n');
}

export function calculateLetterStats(letter: LetterData): { wordCount: number; charCount: number; readingTimeMins: number } {
  const fullText = (letter.bodyParagraphs || []).join(' ');
  const words = fullText.trim() ? fullText.trim().split(/\s+/).length : 0;
  const chars = fullText.length;
  const readingTimeMins = Math.max(1, Math.round(words / 200));
  return { wordCount: words, charCount: chars, readingTimeMins };
}
