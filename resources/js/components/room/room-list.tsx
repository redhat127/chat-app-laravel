import type { Room } from '@/types';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

export const RoomList = ({ rooms, forJoinedRooms = false }: { rooms: Room[]; forJoinedRooms?: boolean }) => {
  return (
    <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))' }}>
      {rooms.map((room) => (
        <Card key={room.id}>
          <CardHeader>
            <CardTitle>
              <h3 className="text-lg font-bold capitalize">{room.name}</h3>
            </CardTitle>
            <CardDescription>Member count: {room.members_count}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">{forJoinedRooms ? 'Enter' : 'Join'}</Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
