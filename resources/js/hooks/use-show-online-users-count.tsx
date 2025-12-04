import { echo } from '@laravel/echo-react';
import { useEffect, useState } from 'react';

export const useShowOnlineUsersCount = (roomId: string) => {
  const [roomOnlineUserIds, setRoomOnlineUserIds] = useState<string[]>([]);

  const e = echo();
  const roomOnlineUserIdsChannel = e.join('room.' + roomId + '.user-id');

  useEffect(() => {
    roomOnlineUserIdsChannel.subscribe();

    roomOnlineUserIdsChannel.here((users: Array<{ user_id: string; current_user_exists_as_member: boolean }>) => {
      setRoomOnlineUserIds(users.filter((user) => user.current_user_exists_as_member).map((user) => user.user_id));
    });

    roomOnlineUserIdsChannel.joining((data: { user_id: string; current_user_exists_as_member: boolean }) => {
      if (!data.current_user_exists_as_member) return;
      setRoomOnlineUserIds((prev) => {
        if (prev.includes(data.user_id)) return prev;
        return [...prev, data.user_id];
      });
    });

    roomOnlineUserIdsChannel.leaving((data: { user_id: string; current_user_exists_as_member: boolean }) => {
      if (!data.current_user_exists_as_member) return;
      setRoomOnlineUserIds((prev) => {
        return prev.filter((uId) => uId !== data.user_id);
      });
    });

    return () => roomOnlineUserIdsChannel.unsubscribe();
  }, [roomOnlineUserIdsChannel]);

  return { usersCount: roomOnlineUserIds };
};
