"use client";

import { useState, useEffect } from "react";
import { supabase, Message } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export function useChat(roomId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Fetch existing messages
    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('room_id', roomId)
          .order('created_at', { ascending: true });

        if (error) throw error;
        if (data) setMessages(data);
      } catch (error) {
        console.error('Error fetching messages:', error);
        toast({
          title: "Error loading messages",
          description: "Please try refreshing the page",
          variant: "destructive",
        });
      }
    };

    fetchMessages();

    // Subscribe to new messages
    const subscription = supabase
      .channel(`room:${roomId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `room_id=eq.${roomId}`,
      }, (payload) => {
        setMessages(current => [...current, payload.new as Message]);
      })
      .subscribe(() => setIsConnected(true));

    return () => {
      subscription.unsubscribe();
      setIsConnected(false);
    };
  }, [roomId, toast]);

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    try {
      const { error } = await supabase.from('messages').insert({
        content,
        room_id: roomId,
        sender_name: 'Anonymous', // Replace with actual user name when auth is implemented
        user_id: 'anonymous', // Replace with actual user ID when auth is implemented
      });

      if (error) throw error;
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Failed to send message",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  return {
    messages,
    sendMessage,
    isConnected,
  };
}