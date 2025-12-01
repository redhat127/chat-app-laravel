import type { Room, User } from '@/types';
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
            {forJoinedRooms ? <Button className="w-full">Enter</Button> : <JoinRoomForm roomId={room.id} />}
            {forJoinedRooms && room.user_id !== user?.id && <LeaveRoomForm roomId={room.id} />}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
