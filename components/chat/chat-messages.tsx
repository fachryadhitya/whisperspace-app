"use client";

import { Message } from "@/lib/supabase";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useRef } from "react";
import { format } from "date-fns";

interface ChatMessagesProps {
  messages: Message[];
}

export function ChatMessages({ messages }: ChatMessagesProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <ScrollArea ref={scrollRef} className="flex-1 p-4">
      <div className="space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex flex-col ${
              message.sender_name === "You" ? "items-end" : "items-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.sender_name === "You"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary"
              }`}
            >
              <div className="text-sm font-medium mb-1">{message.sender_name}</div>
              <div className="text-sm">{message.content}</div>
              <div className="text-xs opacity-70 mt-1">
                {format(new Date(message.created_at), "HH:mm")}
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}