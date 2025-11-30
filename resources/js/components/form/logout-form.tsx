import LogoutController from '@/actions/App/Http/Controllers/LogoutController';
import { router } from '@inertiajs/react';
import { LogOutIcon } from 'lucide-react';
import { useState } from 'react';

export const LogoutForm = () => {
  const [isPending, setIsPending] = useState(false);
  return (
    <form
      className="w-full"
      onSubmit={(e) => {
        e.preventDefault();
        router.post(LogoutController.index(), undefined, {
          onBefore() {
            setIsPending(false);
          },
          onSuccess() {
            setIsPending(true);
          },
        });
      }}
    >
      <button type="submit" disabled={isPending} className="flex w-full items-center gap-1.5 px-2 py-1.5 text-red-600">
        <LogOutIcon className="text-red-600" />
        Logout
      </button>
    </form>
  );
};
