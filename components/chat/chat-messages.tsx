"use client";

import { Message } from "@/lib/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useRef } from "react";
import { format } from "date-fns";
import { getAnonymousId } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { Check, CheckCheck, Clock, AlertCircle } from "lucide-react";

interface ChatMessagesProps {
  messages: Message[];
  typingUsers: string[];
}

export function ChatMessages({ messages, typingUsers }: ChatMessagesProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const currentUserId = getAnonymousId();
  const lastMessageRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever messages or typing status changes
  useEffect(() => {
    const scrollToBottom = () => {
      if (lastMessageRef.current) {
        lastMessageRef.current.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }
    };

    scrollToBottom();

    // Also scroll after a short delay to handle dynamic content loading
    const timeoutId = setTimeout(scrollToBottom, 100);

    return () => clearTimeout(timeoutId);
  }, [messages, typingUsers]);

  const getStatusIcon = (status: Message['status']) => {
    switch (status) {
      case 'sending':
        return <Clock className="h-3 w-3 text-muted-foreground" />;
      case 'sent':
        return <Check className="h-3 w-3 text-primary" />;
      case 'delivered':
        return <CheckCheck className="h-3 w-3 text-primary" />;
      case 'error':
        return <AlertCircle className="h-3 w-3 text-destructive" />;
      default:
        return null;
    }
  };

  return (
    <ScrollArea ref={scrollRef} className="flex-1 p-4">
      <div className="space-y-4">
        {messages.map((message, index) => {
          const isCurrentUser = message.user_id === currentUserId;
          const isLastMessage = index === messages.length - 1;

          return (
            <div
              key={message.id}
              ref={isLastMessage ? lastMessageRef : null}
              className={cn("flex flex-col", isCurrentUser ? "items-end" : "items-start")}
            >
              <div
                className={cn(
                  "max-w-[80%] rounded-lg p-3",
                  isCurrentUser
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary"
                )}
              >
                <div className="text-sm font-medium mb-1">{message.sender_name}</div>
                <div className="text-sm whitespace-pre-wrap break-words">{message.content}</div>
                <div className="text-xs opacity-70 mt-1 flex items-center gap-1">
                  {format(new Date(message.created_at), "HH:mm")}
                  {isCurrentUser && getStatusIcon(message.status)}
                </div>
              </div>
            </div>
          );
        })}
        {typingUsers.length > 0 && (
          <div 
            ref={messages.length === 0 ? lastMessageRef : null}
            className="text-sm text-muted-foreground italic"
          >
            {typingUsers.join(", ")} {typingUsers.length === 1 ? "is" : "are"} typing...
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
