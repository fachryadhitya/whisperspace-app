"use client";

import { Card } from "@/components/ui/card";
import { ChatHeader } from "./chat-header";
import { ChatMessages } from "./chat-messages";
import { ChatInput } from "./chat-input";
import { useChat } from "@/hooks/use-chat";
import { useToast } from "@/hooks/use-toast";

interface ChatContainerProps {
  roomId: string;
}

export function ChatContainer({ roomId }: ChatContainerProps) {
  const { toast } = useToast();
  const { 
    messages, 
    sendMessage, 
    isConnected,
    onlineUsers,
    typingUsers,
    handleTyping,
    disconnect
  } = useChat(roomId);

  const handleLeaveRoom = () => {
    disconnect();
    toast({
      title: "Left Room",
      description: "You have successfully left the support room.",
    });
  };

  return (
    <div className="container mx-auto px-4 py-6 h-screen flex flex-col">
      <Card className="flex-1 p-4 mb-4 overflow-hidden flex flex-col">
        <ChatHeader 
          participantCount={onlineUsers.length} 
          isConnected={isConnected} 
          roomId={roomId}
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
