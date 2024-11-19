"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { supabase, Message, getAnonymousId } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { generateWhimsicalName } from "@/lib/names";
import { usePresence } from "./use-presence";
import { RealtimeChannel } from "@supabase/supabase-js";

export function useChat(roomId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();
  const { userPreferences } = useAuth();
  const anonymousId = getAnonymousId();
  const senderName = generateWhimsicalName(anonymousId);
  const { onlineUsers, typingUsers, setTyping, disconnect: disconnectPresence } = usePresence(roomId);
  const channelRef = useRef<RealtimeChannel | null>(null);

  const fetchMessages = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('room_id', roomId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      if (data) setMessages(data.map(msg => ({ ...msg, status: 'delivered' })));
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Error loading messages",
        description: "Please try refreshing the page",
        variant: "destructive",
      });
    }
  }, [roomId, toast]);

  useEffect(() => {
    let mounted = true;

    const setupRealtimeSubscription = async () => {
      await fetchMessages();

      const channel = supabase.channel(`room:${roomId}`, {
        config: {
          broadcast: { self: true },
        },
      });

      channelRef.current = channel;

      channel
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `room_id=eq.${roomId}`,
          },
          (payload) => {

            const newMessage = payload.new as Message;
            setMessages((current) => {
              const messageIds = new Set(current.map(msg => msg.id));
              if (messageIds.has(newMessage.id)) return current;
              
              return [...current, { ...newMessage, status: 'delivered' }];
            });
          }
        )
        .subscribe(async (status) => {
            setIsConnected(status === 'SUBSCRIBED');
          
        });
    };

    setupRealtimeSubscription();

    return () => {
      mounted = false;
      disconnect();
    };
  }, [roomId, fetchMessages]);

  const disconnect = useCallback(() => {
    if (channelRef.current) {
      channelRef.current.unsubscribe();
      channelRef.current = null;
    }
    disconnectPresence();
    setIsConnected(false);
  }, [disconnectPresence]);

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    const messageData = {
      content,
      room_id: roomId,
      user_id: anonymousId,
      sender_name: senderName,
      category: userPreferences?.supportCategory || 'general',
    };

    const optimisticMessage = {
      ...messageData,
      id: `temp-${Date.now()}`,
      created_at: new Date().toISOString(),
      status: 'sending' as const,
    };

    setMessages((current) => [...current, optimisticMessage]);

    try {
      const { data, error } = await supabase
        .from('messages')
        .insert([messageData])
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setMessages((current) =>
          current.map((msg) =>
            msg.id === optimisticMessage.id
              ? { ...data, status: 'sent' as const }
              : msg
          )
        );
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((current) =>
        current.map((msg) =>
          msg.id === optimisticMessage.id
            ? { ...msg, status: 'error' as const }
            : msg
        )
      );
      toast({
        title: "Failed to send message",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleTyping = (isTyping: boolean) => {
    setTyping(isTyping);
  };

  return {
    messages,
    sendMessage,
    isConnected,
    onlineUsers,
    typingUsers,
    handleTyping,
    disconnect,
  };
}
