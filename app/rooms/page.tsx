"use client";

import { useEffect, useState } from "react";
import { getUserRooms } from "@/lib/room";
import { ChatRoom } from "@/lib/types";
import { getAnonymousId } from "@/lib/supabase";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { Users, Calendar } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { createRoom } from "@/lib/room";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

export default function RoomsPage() {
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const userId = getAnonymousId();
  const router = useRouter();
  const { userPreferences } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    loadRooms();
  }, []);

  async function loadRooms() {
    try {
      const userRooms = await getUserRooms(userId);
      setRooms(userRooms);
    } catch (error) {
      console.error("Error loading rooms:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleCreateRoom = async () => {
    if (!userPreferences?.supportCategory) {
      toast({
        title: "Error",
        description: "Please complete your preferences first",
        variant: "destructive",
      });
      return;
    }

    try {
      const roomId = await createRoom(userId, userPreferences.supportCategory);
      router.push(`/chat/${roomId}`);
    } catch (error) {
      toast({
        title: "Error creating room",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Support Rooms</h1>
        <Button onClick={handleCreateRoom}>Create New Room</Button>
      </div>

      {loading ? (
        <div className="text-center text-muted-foreground">Loading rooms...</div>
      ) : rooms.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground mb-4">You haven't joined any rooms yet.</p>
            <Button onClick={handleCreateRoom}>Create Your First Room</Button>
          </CardContent>
        </Card>
      ) : (
        <ScrollArea className="h-[calc(100vh-12rem)]">
          <div className="grid gap-4">
            {rooms.map((room) => (
              <Link key={room.id} href={`/chat/${room.id}`}>
                <Card className="hover:bg-muted/50 transition-colors">
                  <CardHeader>
                    <CardTitle>{room.name}</CardTitle>
                    <CardDescription>{room.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>{room.participant_count} participants</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>
                          Joined {format(new Date(room.created_at), "MMM d, yyyy")}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
