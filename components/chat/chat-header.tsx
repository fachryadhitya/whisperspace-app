"use client";

import { MessageCircle, Wifi, WifiOff } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface ChatHeaderProps {
  participantCount: number;
  isConnected: boolean;
}

export function ChatHeader({ participantCount, isConnected }: ChatHeaderProps) {
  return (
    <div className="flex items-center gap-2 p-3 border-b">
      <MessageCircle className="h-5 w-5" />
      <h1 className="text-lg font-semibold">Support Group Chat</h1>
      <div className="ml-auto flex items-center gap-3">
        <span className="text-sm text-muted-foreground">
          {participantCount} participants
        </span>
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              {isConnected ? (
                <Wifi className="h-4 w-4 text-green-500" />
              ) : (
                <WifiOff className="h-4 w-4 text-destructive" />
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isConnected ? "Connected" : "Disconnected"}</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}