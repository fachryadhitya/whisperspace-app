"use client";

import { MessageCircle, Wifi, WifiOff, Users, LogOut } from "lucide-react";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface ChatHeaderProps {
  participantCount: number;
  isConnected: boolean;
  roomId: string;
  onLeaveRoom: () => void;
}

export function ChatHeader({ participantCount, isConnected, roomId, onLeaveRoom }: ChatHeaderProps) {
  const router = useRouter();
  const roomName = roomId
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const handleLeaveRoom = () => {
    onLeaveRoom();
    router.push("/");
  };

  return (
    <div className="flex items-center gap-2 p-3 border-b">
      <MessageCircle className="h-5 w-5" />
      <h1 className="text-lg font-semibold">{roomName}</h1>
      <div className="ml-auto flex items-center gap-3">
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span className="text-sm text-muted-foreground">
                {participantCount}
              </span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{participantCount} online</p>
          </TooltipContent>
        </Tooltip>
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
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
              <LogOut className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Leave Room</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to leave this support room? You can always join another room later.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleLeaveRoom} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Leave Room
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
