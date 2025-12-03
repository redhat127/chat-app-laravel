import ChatRoomController from '@/actions/App/Http/Controllers/ChatRoomController';
import { Button } from '@/components/ui/button';
import { LoadingSwap } from '@/components/ui/loading-swap';
import { useUser } from '@/hooks/use-user';
import { cn } from '@/lib/utils';
import { router } from '@inertiajs/react';
import { useQueryClient } from '@tanstack/react-query';
import { DoorOpen } from 'lucide-react';
import { useState } from 'react';

export const JoinRoomForm = ({ roomId, useAsDropDownMenuItem = false }: { roomId: string; useAsDropDownMenuItem?: boolean }) => {
  const [isFormDisabled, setIsFormDisabled] = useState(false);
  const queryClient = useQueryClient();
  const user = useUser()!;
  const btnClassName = cn('w-full', { 'flex items-center gap-1.5 px-2 py-1.5': useAsDropDownMenuItem });
  return (
    <form
      className="w-full"
      onSubmit={(e) => {
        e.preventDefault();
        router.post(
          ChatRoomController.joinRoom(),
          { roomId },
          {
            preserveScroll: true,
            preserveState: 'errors',
            onBefore() {
              setIsFormDisabled(true);
            },
            onFinish() {
              setIsFormDisabled(false);
            },
            onSuccess() {
              queryClient.refetchQueries({
                predicate(query) {
                  const key = query.queryKey;

                  if (!Array.isArray(key) || key.length < 2) return false;

                  const [primary, params] = key;

                  const isTargetPrimary = ['joined-room-list', 'public-room-list'].includes(primary);
                  if (!isTargetPrimary) return false;

                  if (typeof params !== 'object' || params === null) return false;

                  return params.userId === user.id;
                },
              });
            },
          },
        );
      }}
    >
      {useAsDropDownMenuItem ? (
        <button type="submit" disabled={isFormDisabled} className={btnClassName}>
          <DoorOpen />
          Join
        </button>
      ) : (
        <Button type="submit" disabled={isFormDisabled} className={btnClassName}>
          <LoadingSwap isLoading={isFormDisabled}>Join</LoadingSwap>
        </Button>
      )}
    </form>
  );
};
