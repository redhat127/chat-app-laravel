import ChatRoomController from '@/actions/App/Http/Controllers/ChatRoomController';
import { Button } from '@/components/ui/button';
import { LoadingSwap } from '@/components/ui/loading-swap';
import { useUser } from '@/hooks/use-user';
import { cn } from '@/lib/utils';
import { router } from '@inertiajs/react';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

export const LeaveRoomForm = ({ roomId, btnClassName = '' }: { roomId: string; btnClassName?: string }) => {
  const [isFormDisabled, setIsFormDisabled] = useState(false);
  const queryClient = useQueryClient();
  const user = useUser()!;
  return (
    <form
      className="max-w-lg"
      onSubmit={(e) => {
        e.preventDefault();
        router.post(
          ChatRoomController.leaveRoom(),
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
      <Button type="submit" disabled={isFormDisabled} className={cn('w-full', btnClassName)} variant="destructive">
        <LoadingSwap isLoading={isFormDisabled}>Leave</LoadingSwap>
      </Button>
    </form>
  );
};
