import { useFlashMessage } from '@/hooks/use-flash-message';
import { useUser } from '@/hooks/use-user';
import { home } from '@/routes';
import { Link } from '@inertiajs/react';
import { MessageCircleDashed } from 'lucide-react';
import { useEffect, type ReactNode } from 'react';
import { toast } from 'sonner';
import { Toaster } from '../ui/sonner';
import { UserDropdown } from '../user-dropdown';

export const BaseLayout = ({ children }: { children: ReactNode }) => {
  const flashMessage = useFlashMessage();
  const user = useUser();
  useEffect(() => {
    if (flashMessage) {
      toast[flashMessage.type](flashMessage.text);
    }
  }, [flashMessage]);
  return (
    <>
      {user && (
        <header className="flex items-center justify-between border-b p-4 px-8">
          <Link href={home()} className="flex items-center gap-2 text-2xl font-bold text-orange-600">
            <MessageCircleDashed />
            <span className="hidden sm:block">Chat App</span>
          </Link>
          <UserDropdown user={user} />
        </header>
      )}
      <main>
        {children}
        <Toaster expand position="top-center" />
      </main>
    </>
  );
};
