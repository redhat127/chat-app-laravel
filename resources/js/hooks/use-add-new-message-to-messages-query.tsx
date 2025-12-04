import { scrollWindowToBottom } from '@/lib/utils';
import type { Message, PaginatedMessagesResponse } from '@/types';
import { useQueryClient, type InfiniteData } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';

export const useAddNewMessageToMessagesQuery = (roomId: string, scrollToRoomMessagesEndIfInView = false) => {
  const queryClient = useQueryClient();
  const [shouldScrollWindowToBottom, setShouldScrollWindowToBottom] = useState(false);
  const addNewMessageToMessagesQuery = useCallback(
    (data: { new_message: Message }) => {
      queryClient.setQueryData<InfiniteData<PaginatedMessagesResponse>>(['messages', { roomId }], (oldData) => {
        if (!oldData?.pages.length) return oldData;

        const updatedPages = [...oldData.pages];

        updatedPages[0] = {
          ...updatedPages[0],
          messages: [data.new_message, ...updatedPages[0].messages],
        };

        return {
          ...oldData,
          pages: updatedPages,
        };
      });
      setShouldScrollWindowToBottom(true);
    },
    [queryClient, roomId],
  );
  useEffect(() => {
    if (shouldScrollWindowToBottom) {
      if (!scrollToRoomMessagesEndIfInView) {
        scrollWindowToBottom();
      } else {
        const roomMessagesEnd = document.querySelector('#room-messages-end');
        if (roomMessagesEnd) {
          const rect = roomMessagesEnd.getBoundingClientRect();
          const isInView = rect.top >= 0 && rect.bottom <= window.innerHeight;
          if (isInView) {
            scrollWindowToBottom();
          }
        }
      }
    }
    return () => setShouldScrollWindowToBottom(false);
  }, [shouldScrollWindowToBottom, scrollToRoomMessagesEndIfInView]);
  return { addNewMessageToMessagesQuery };
};
