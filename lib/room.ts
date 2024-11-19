import { nanoid } from 'nanoid';
import { supabase } from './supabase';
import { ChatRoom, UserRoom } from './types';

export async function createRoom(userId: string, category: string, isPrivate: boolean = false): Promise<string> {
  const roomId = nanoid(10); // Generate a random 10-character room ID
  
  const { error } = await supabase
    .from('rooms')
    .insert({
      id: roomId,
      name: `${category} Support Room`,
      description: `A safe space for ${category} support`,
      category,
      created_by: userId,
      is_private: isPrivate,
      participant_count: 1,
    });

  if (error) throw error;

  // Add user to room
  await joinRoom(userId, roomId);

  return roomId;
}

export async function joinRoom(userId: string, roomId: string): Promise<void> {
  const { error: joinError } = await supabase
    .from('user_rooms')
    .insert({
      user_id: userId,
      room_id: roomId,
      joined_at: new Date().toISOString(),
      last_read_at: new Date().toISOString(),
      active: true,
    });

  if (joinError) throw joinError;

  // Increment participant count
  const { error: updateError } = await supabase.rpc('increment_participant_count', {
    room_id: roomId
  });

  if (updateError) throw updateError;
}

export async function getUserRooms(userId: string): Promise<ChatRoom[]> {
  const { data, error } = await supabase
    .from('user_rooms')
    .select(`
      room_id,
      active,
      rooms:room_id (
        id,
        name,
        description,
        category,
        created_at,
        created_by,
        is_private,
        last_message_at,
        participant_count
      )
    `)
    .eq('user_id', userId)
    .order('joined_at', { ascending: false });

  if (error) throw error;

  return data.map(item => ({
    ...item.rooms,
    active: item.active,
  }));
}

export async function leaveRoom(userId: string, roomId: string): Promise<void> {
  const { error: leaveError } = await supabase
    .from('user_rooms')
    .update({ active: false, left_at: new Date().toISOString() })
    .eq('user_id', userId)
    .eq('room_id', roomId);

  if (leaveError) throw leaveError;

  // Decrement participant count
  const { error: updateError } = await supabase.rpc('decrement_participant_count', {
    room_id: roomId
  });

  if (updateError) throw updateError;
}
