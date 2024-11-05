import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ziluswablqfttsjunawa.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppbHVzd2FibHFmdHRzanVuYXdhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMDc4ODI3NSwiZXhwIjoyMDQ2MzY0Mjc1fQ.tYqRLFhYjEPs1FW9brkzFvbmhLgYcKDbE1iIx59AJFI'

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Message = {
  id: string;
  created_at: string;
  content: string;
  room_id: string;
  user_id: string;
  sender_name: string;
};