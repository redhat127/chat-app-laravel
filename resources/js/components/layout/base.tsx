import { useFlashMessage } from '@/hooks/use-flash-message';
import { useEffect, type ReactNode } from 'react';
import { toast } from 'sonner';
import { Toaster } from '../ui/sonner';

export const BaseLayout = ({ children }: { children: ReactNode }) => {
  const flashMessage = useFlashMessage();
  useEffect(() => {
    if (flashMessage) {
      toast[flashMessage.type](flashMessage.text);
    }
  }, [flashMessage]);
  return (
    <main>
      {children}
      <Toaster expand position="top-center" />
    </main>
  );
};
