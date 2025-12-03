import room from '@/routes/room';
import type { Room, User } from '@/types';
import { useSuspenseQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Suspense } from 'react';
import { ReactQueryResetBoundary } from '../react-query-reset-boundary';
import { RoomList } from './room-list';
import { RoomListSkeleton } from './room-list-skeleton';

const getJoinedRoomList = async () => {
  const {
    data: { joined_room_list },
  } = await axios.get<{ joined_room_list: Room[] }>(room.joinedRoomList.url());
  return joined_room_list;
};

export const JoinedRoomListSuspenseQuery = ({ user }: { user: User }) => {
  const { data: rooms } = useSuspenseQuery({
    queryKey: ['joined-room-list', { userId: user.id }],
    queryFn: getJoinedRoomList,
    staleTime: 1000 * 60 * 60 * 24,
  });
  return rooms.length > 0 ? (
    <RoomList rooms={rooms} forJoinedRooms user={user} />
  ) : (
    <p className="text-sm text-muted-foreground italic">No room found.</p>
  );
};

export const JoinedRoomList = ({ user }: { user: User }) => {
  return (
    <ReactQueryResetBoundary errorText="Failed to get rooms.">
      <Suspense fallback={<RoomListSkeleton />}>
        <JoinedRoomListSuspenseQuery user={user} />
      </Suspense>
    </ReactQueryResetBoundary>
  );
};
