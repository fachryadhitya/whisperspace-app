"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { useState, useEffect } from "react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onTyping: (isTyping: boolean) => void;
  disabled?: boolean;
}

export function ChatInput({ onSendMessage, onTyping, disabled }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    let typingTimeout: NodeJS.Timeout;

    if (isTyping) {
      onTyping(true);
      typingTimeout = setTimeout(() => {
        setIsTyping(false);
        onTyping(false);
      }, 2000);
    }

    return () => {
      clearTimeout(typingTimeout);
    };
  }, [isTyping, onTyping]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    setIsTyping(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
      setIsTyping(false);
      onTyping(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 p-2 border-t">
      <Input
        value={message}
        onChange={handleChange}
        placeholder={disabled ? "Connecting..." : "Type your message..."}
        disabled={disabled}
        className="flex-1"
      />
      <Button type="submit" size="icon" disabled={disabled || !message.trim()}>
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
}
