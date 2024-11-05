import { ChatContainer } from "@/components/chat/chat-container";

export const dynamic = 'force-dynamic';

export default function ChatRoomPage({
  params,
}: {
  params: { roomId: string };
}) {
  return <ChatContainer roomId={params.roomId} />;
}
