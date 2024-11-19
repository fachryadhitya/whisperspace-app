"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@/lib/types';
import { getAnonymousId } from '@/lib/supabase';
import { generateWhimsicalName } from '@/lib/names';
import { RealtimeChannel } from '@supabase/supabase-js';

export function usePresence(roomId: string) {
  const [onlineUsers, setOnlineUsers] = useState<User[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const currentUserId = getAnonymousId();
  const currentUserName = generateWhimsicalName(currentUserId);

  useEffect(() => {
    let mounted = true;
    
    const initializePresence = async () => {
      const channel = supabase.channel(`presence:${roomId}`, {
        config: {
          presence: {
            key: currentUserId,
          },
        },
      });

      channelRef.current = channel;

      try {
        await channel.subscribe(async (status) => {
          if (status === 'SUBSCRIBED' && mounted) {
            await channel.track({
              userId: currentUserId,
              name: currentUserName,
              isTyping: false,
              lastSeen: new Date().toISOString(),
            });
          }
        });

        channel
          .on('presence', { event: 'sync' }, () => {
            const state = channel.presenceState();
            const users = Object.values(state).flat().map((user: any) => ({
              id: user.userId,
              name: user.name,
              isTyping: user.isTyping,
              lastSeen: user.lastSeen,
            }));
            setOnlineUsers(users);
          })
          .on('presence', { event: 'join' }, ({ key, newPresences }) => {
            const newUser = newPresences[0];
            setOnlineUsers(prev => [...prev, {
              id: key,
              name: newUser.name,
              isTyping: false,
              lastSeen: new Date().toISOString(),
            }]);
          })
          .on('presence', { event: 'leave' }, ({ key }) => {
            if (!mounted) return;
            setOnlineUsers(prev => prev.filter(user => user.id !== key));
          });

      } catch (error) {
        console.error('Error initializing presence:', error);
      }
    };

    initializePresence();

    return () => {
      mounted = false;
      disconnect();
    };
  }, [roomId, currentUserId, currentUserName]);

  const disconnect = useCallback(() => {
    if (channelRef.current) {
      channelRef.current.unsubscribe();
      channelRef.current = null;
    }
  }, []);

  const setTyping = async (isTyping: boolean) => {
    try {
      if (!channelRef.current) {
        throw new Error('Channel not initialized');
      }

      await channelRef.current.track({
        userId: currentUserId,
        name: currentUserName,
        isTyping,
        lastSeen: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error updating typing status:', error);
    }
  };

  return {
    onlineUsers,
    typingUsers,
    setTyping,
    currentUserId,
    currentUserName,
    disconnect,
  };
}
