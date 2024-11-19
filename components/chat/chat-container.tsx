"use client";

import { Card } from "@/components/ui/card";
import { ChatHeader } from "./chat-header";
import { ChatMessages } from "./chat-messages";
import { ChatInput } from "./chat-input";
import { useChat } from "@/hooks/use-chat";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ChatRoom } from "@/lib/types";
import { leaveRoom } from "@/lib/room";
import { getAnonymousId } from "@/lib/supabase";

interface ChatContainerProps {
  roomId: string;
}

export function ChatContainer({ roomId }: ChatContainerProps) {
  const { toast } = useToast();
  const [room, setRoom] = useState<ChatRoom | null>(null);
  const { 
    messages, 
    sendMessage, 
    isConnected,
    onlineUsers,
    typingUsers,
    handleTyping,
    disconnect
  } = useChat(roomId);

  useEffect(() => {
    async function loadRoom() {
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('id', roomId)
        .single();

      if (error) {
        toast({
          title: "Error",
          description: "Failed to load room details",
          variant: "destructive",
        });
        return;
      }

      setRoom(data);
    }

    loadRoom();
  }, [roomId, toast]);

  const handleLeaveRoom = async () => {
    try {
      await leaveRoom(getAnonymousId(), roomId);
      disconnect();
      toast({
        title: "Left Room",
        description: "You have successfully left the support room.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to leave room. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!room) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-6 h-screen flex flex-col">
      <Card className="flex-1 p-4 mb-4 overflow-hidden flex flex-col">
        <ChatHeader 
          participantCount={onlineUsers.length} 
          isConnected={isConnected} 
          roomId={roomId}
          roomName={room.name}
          onLeaveRoom={handleLeaveRoom}
        />
        <ChatMessages 
          messages={messages} 
          typingUsers={typingUsers}
        />
        <ChatInput 
          onSendMessage={sendMessage} 
          onTyping={handleTyping}
          disabled={!isConnected} 
        />
      </Card>
    </div>
  );
}
