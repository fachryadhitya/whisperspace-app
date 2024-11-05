export interface User {
  id: string;
  name: string;
  isTyping: boolean;
  lastSeen: string;
}

export interface Message {
  id: string;
  created_at: string;
  content: string;
  room_id: string;
  user_id: string;
  sender_name: string;
  category: string;
  status: 'sending' | 'sent' | 'delivered' | 'error';
}
