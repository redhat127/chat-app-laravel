import type { flashMessage } from '@/types';
import { usePage } from '@inertiajs/react';

export const useFlashMessage = () => {
  const {
    props: { flashMessage },
  } = usePage<{ flashMessage: flashMessage }>();
  return flashMessage;
};
