import ChatRoomController from '@/actions/App/Http/Controllers/ChatRoomController';
import { Button } from '@/components/ui/button';
import { LoadingSwap } from '@/components/ui/loading-swap';
import { router } from '@inertiajs/react';
import { useState } from 'react';

export const LeaveRoomForm = ({ roomId }: { roomId: string }) => {
  const [isFormDisabled, setIsFormDisabled] = useState(false);
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
          },
        );
      }}
    >
      <Button type="submit" disabled={isFormDisabled} className="w-full" variant="destructive">
        <LoadingSwap isLoading={isFormDisabled}>Leave</LoadingSwap>
      </Button>
    </form>
  );
};
