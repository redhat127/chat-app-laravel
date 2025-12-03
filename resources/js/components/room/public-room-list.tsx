import room from '@/routes/room';
import type { Room } from '@/types';
import { useSuspenseQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Suspense } from 'react';
import { ReactQueryResetBoundary } from '../react-query-reset-boundary';
import { RoomList } from './room-list';
import { RoomListSkeleton } from './room-list-skeleton';

const getPublicRoomList = async () => {
  const {
    data: { public_room_list },
  } = await axios.get<{ public_room_list: Room[] }>(room.publicRoomList.url());
  return public_room_list;
};

export const PublicRoomListSuspenseQuery = ({ userId }: { userId: string }) => {
  const { data: rooms } = useSuspenseQuery({
    queryKey: ['public-room-list', { userId }],
    queryFn: getPublicRoomList,
    staleTime: 1000 * 60 * 60 * 24,
  });
  return rooms.length > 0 ? <RoomList rooms={rooms} /> : <p className="text-sm text-muted-foreground italic">No room found.</p>;
};

export const PublicRoomList = ({ userId }: { userId: string }) => {
  return (
    <ReactQueryResetBoundary errorText="Failed to get rooms.">
      <Suspense fallback={<RoomListSkeleton />}>
        <PublicRoomListSuspenseQuery userId={userId} />
      </Suspense>
    </ReactQueryResetBoundary>
  );
};
