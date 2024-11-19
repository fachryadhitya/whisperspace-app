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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface ChatContainerProps {
  roomId: string;
}

export function ChatContainer({ roomId }: ChatContainerProps) {
  const { toast } = useToast();
  const router = useRouter();
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
      const { data: roomData, error: roomError } = await supabase
        .from('rooms')
        .select('*')
        .eq('id', roomId)
        .single();

      if (roomError) {
        toast({
          title: "Error",
          description: "Failed to load room details",
          variant: "destructive",
        });
        return;
      }

      // Check if user is still active in this room
      const { data: userRoomData, error: userRoomError } = await supabase
        .from('user_rooms')
        .select('active')
        .eq('room_id', roomId)
        .eq('user_id', getAnonymousId())
        .single();

      if (userRoomError) {
        toast({
          title: "Error",
          description: "You are not authorized to view this room",
          variant: "destructive",
        });

        router.push('/rooms');
        return;
      }

      setRoom({
        ...roomData,
        active: userRoomData.active,
      });
    }

    loadRoom();
  }, [roomId, toast]);

  const handleLeaveRoom = async () => {
    try {
      await leaveRoom(getAnonymousId(), roomId);
      setRoom(prev => prev ? { ...prev, active: false } : null);
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
          isAnActiveRoom={room.active || false}
        />
        {!room.active && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You have left this room. You can view the chat history but cannot send new messages.
            </AlertDescription>
          </Alert>
        )}
        <ChatMessages 
          messages={messages} 
          typingUsers={typingUsers}
        />
        <ChatInput 
          onSendMessage={sendMessage} 
          onTyping={handleTyping}
          disabled={!isConnected || !room.active} 
        />
      </Card>
    </div>
  );
}
