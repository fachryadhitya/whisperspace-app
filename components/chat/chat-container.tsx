"use client";

import { Card } from "@/components/ui/card";
import { ChatHeader } from "./chat-header";
import { ChatMessages } from "./chat-messages";
import { ChatInput } from "./chat-input";
import { useChat } from "@/hooks/use-chat";

export function ChatContainer() {
  const { messages, sendMessage, isConnected } = useChat("demo-room");

  return (
    <div className="container mx-auto px-4 py-6 h-screen flex flex-col">
      <Card className="flex-1 p-4 mb-4 overflow-hidden flex flex-col">
        <ChatHeader participantCount={5} isConnected={isConnected} />
        <ChatMessages messages={messages} />
        <ChatInput onSendMessage={sendMessage} disabled={!isConnected} />
      </Card>
    </div>
  );
}