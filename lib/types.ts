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

export interface ChatRoom {
  id: string;
  name: string;
  description: string;
  category: string;
  created_at: string;
  created_by: string;
  is_private: boolean;
  last_message_at: string | null;
  participant_count: number;
  active?: boolean;
}

export interface UserRoom {
  user_id: string;
  room_id: string;
  joined_at: string;
  last_read_at: string;
  active: boolean;
  left_at?: string;
}
