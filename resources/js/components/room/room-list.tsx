import { show } from '@/routes/room';
import type { Room, User } from '@/types';
import { Link } from '@inertiajs/react';
import { JoinRoomForm } from '../form/chat-room/join-room-form';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { LeaveRoomForm } from './leave-room-form';

export const RoomList = ({ rooms, forJoinedRooms = false, user }: { rooms: Room[]; forJoinedRooms?: boolean; user?: User }) => {
  return (
    <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))' }}>
      {rooms.map((room) => (
        <Card key={room.id}>
          <CardHeader>
            <CardTitle>
              <h3 className="text-lg font-bold capitalize">{room.name}</h3>
            </CardTitle>
            <CardDescription>
              {room.members_count} {room.members_count === 1 ? 'member' : 'members'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {!forJoinedRooms && <JoinRoomForm roomId={room.id} />}
            <Button asChild className="w-full">
              <Link href={show({ roomId: room.id })}>Enter</Link>
            </Button>
            {forJoinedRooms && room.user_id !== user?.id && <LeaveRoomForm roomId={room.id} />}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
