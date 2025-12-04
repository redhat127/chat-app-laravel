import type { Message } from '@/types';
import { useEcho } from '@laravel/echo-react';
import { useEffect } from 'react';
import { useAddNewMessageToMessagesQuery } from './use-add-new-message-to-messages-query';

export const useShowRealTimeMessages = (roomId: string, event?: string) => {
  const { addNewMessageToMessagesQuery } = useAddNewMessageToMessagesQuery(roomId, true);

  const { listen, leave } = useEcho<{ new_message: Message }>('room.' + roomId, event, (data) => {
    addNewMessageToMessagesQuery(data);
  });

  useEffect(() => {
    listen();
    return () => {
      leave();
    };
  }, [listen, leave]);
};
