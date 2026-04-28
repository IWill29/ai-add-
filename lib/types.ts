export interface Message {
  id: string;
  role: 'user' | 'bot';
  content: string;
  isAd?: boolean;
  imageUrl?: string;
  imagePrompt?: string;
  attachmentUrl?: string;
}
