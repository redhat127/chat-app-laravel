import { cn } from '@/lib/utils';
import message from '@/routes/message';
import type { Message } from '@/types';
import { useSuspenseQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Suspense, useCallback, useEffect, useRef } from 'react';
import { ReactQueryResetBoundary } from '../react-query-reset-boundary';
import { MessageListSkeleton } from './message-list-skeleton';

const getRoomMessages = async (roomId: string, signal: AbortSignal) => {
  const {
    data: { messages },
  } = await axios.get<{ messages: Message[] }>(message.index.url({ roomId }), {
    signal,
  });
  return messages;
};

const MessageListSuspenseQuery = ({ roomId }: { roomId: string }) => {
  const { data: messages } = useSuspenseQuery({
    queryKey: ['messages', { roomId }],
    queryFn: ({ signal }) => getRoomMessages(roomId, signal),
    staleTime: 1000 * 10,
  });
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  const scrollToLatestMessage = useCallback(() => {
    if (!endOfMessagesRef.current) return;
    endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      scrollToLatestMessage();
    }
  }, [messages, scrollToLatestMessage]);

  return messages.length > 0 ? (
    <div className="flex flex-col gap-2">
      {messages.map((message) => {
        const className = {
          'border sm:self-start': !message.is_mine,
          'bg-sky-600 text-white sm:self-end': message.is_mine,
        };
        const pClassName = {
          'text-muted-foreground': !message.is_mine,
          'text-gray-200': message.is_mine,
        };
        const messageCreatedAt = new Date(message.created_at).toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
        });
        return (
          <div key={message.id} className={cn('max-w-1/2 space-y-1 rounded-md px-4 py-2', className)}>
            {message.user && <p className={cn('text-xs italic', pClassName)}>{message.user.name}:</p>}
            <p className="text-sm">{message.text}</p>
            <p className={cn('text-xs italic', pClassName)}>{messageCreatedAt}</p>
          </div>
        );
      })}
      <div ref={endOfMessagesRef} />
    </div>
  ) : (
    <p className="text-sm text-muted-foreground italic">No message found.</p>
  );
};

export const MessageList = ({ roomId }: { roomId: string }) => {
  return (
    <ReactQueryResetBoundary errorText="Failed to get messages.">
      <Suspense fallback={<MessageListSkeleton />}>
        <MessageListSuspenseQuery roomId={roomId} />
      </Suspense>
    </ReactQueryResetBoundary>
  );
};
