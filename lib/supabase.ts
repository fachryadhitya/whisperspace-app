"use client";

import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Generate a unique anonymous ID for the user
export const getAnonymousId = () => {  
  let anonymousId = window.localStorage.getItem('anonymousId');
  if (!anonymousId) {
    anonymousId = uuidv4();
    window.localStorage.setItem('anonymousId', anonymousId);
  }
  return anonymousId;
};

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
