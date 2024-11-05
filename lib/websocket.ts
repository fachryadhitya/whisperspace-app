"use client";

import { toast } from "sonner";

type WebSocketMessage = {
  type: "message" | "user_joined" | "user_left";
  data: any;
};

export class ChatWebSocket {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout = 1000;
  private messageHandlers: ((message: any) => void)[] = [];

  constructor(private roomId: string) {
    this.connect();
  }

  private connect() {
    // In a real app, this would be an environment variable
    const wsUrl = `wss://api.whisperspace.com/ws/chat/${this.roomId}`;
    
    // For demo purposes, we'll simulate WebSocket with a delay
    setTimeout(() => {
      this.handleOpen();
      // Simulate receiving a message every few seconds
      setInterval(() => {
        this.handleMessage({
          type: "message",
          data: {
            id: `msg-${Date.now()}`,
            sender: ["Alice", "Bob", "Charlie"][Math.floor(Math.random() * 3)],
            content: ["How is everyone doing today?", "I'm here to listen", "Thank you for sharing"][Math.floor(Math.random() * 3)],
            timestamp: new Date(),
          },
        });
      }, 5000);
    }, 1000);
  }

  private handleOpen = () => {
    this.reconnectAttempts = 0;
    toast.success("Connected to chat");
  };

  private handleClose = () => {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => this.connect(), this.reconnectTimeout);
      toast("Reconnecting to chat...");
    } else {
      toast.error("Unable to connect to chat. Please try again later.");
    }
  };

  private handleMessage = (message: WebSocketMessage) => {
    this.messageHandlers.forEach((handler) => handler(message.data));
  };

  public sendMessage(content: string) {
    // In a real implementation, this would send to the WebSocket server
    this.handleMessage({
      type: "message",
      data: {
        id: `msg-${Date.now()}`,
        sender: "You",
        content,
        timestamp: new Date(),
      },
    });
  }

  public onMessage(handler: (message: any) => void) {
    this.messageHandlers.push(handler);
    return () => {
      this.messageHandlers = this.messageHandlers.filter((h) => h !== handler);
    };
  }

  public disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}