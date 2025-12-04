import { cn } from '@/lib/utils';
import message from '@/routes/message';
import type { PaginatedMessagesResponse } from '@/types';
import { useSuspenseInfiniteQuery, type InfiniteData } from '@tanstack/react-query';
import axios from 'axios';
import { Suspense, useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import { ReactQueryResetBoundary } from '../react-query-reset-boundary';
import { UserAvatar } from '../user-avatar';
import { MessageListSkeleton } from './message-list-skeleton';

const getRoomMessages = async (roomId: string, signal: AbortSignal, cursor?: string) => {
  const url = new URL(message.index.url({ roomId }), window.location.origin);
  if (cursor) url.searchParams.set('cursor', cursor);
  const { data } = await axios.get<PaginatedMessagesResponse>(url.toString(), { signal });
  return data;
};

const MessageListSuspenseQuery = ({ roomId }: { roomId: string }) => {
  const roomMessageScrollTargetRef = useRef<HTMLDivElement>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching } = useSuspenseInfiniteQuery<
    PaginatedMessagesResponse,
    Error,
    InfiniteData<PaginatedMessagesResponse>,
    ['messages', { roomId: string }],
    string | undefined
  >({
    queryKey: ['messages', { roomId }],
    queryFn: ({ signal, pageParam }) => getRoomMessages(roomId, signal, pageParam),
    getNextPageParam: (lastPage) => lastPage.next_cursor ?? undefined,
    initialPageParam: undefined,
    staleTime: 10 * 1000,
  });

  const allMessages = data.pages.flatMap((page) => page.messages);

  const { ref: loadMoreRef } = useInView({
    rootMargin: '400px',
    onChange: (inView) => {
      if (inView && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
  });

  useEffect(() => {
    const roomMessageScrollTarget = roomMessageScrollTargetRef.current;
    if (roomMessageScrollTarget) {
      roomMessageScrollTarget.scrollIntoView({ behavior: 'auto' });
    }
  }, []);

  return (
    <>
      {!isFetching && <div ref={loadMoreRef} />}
      {isFetchingNextPage && (
        <div className="fixed top-4 left-4 rounded-md bg-red-600 p-2 px-4 text-center text-sm text-white">Loading older messages...</div>
      )}
      <div className="flex flex-col-reverse space-y-2">
        {allMessages.map((message) => {
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
            <div key={message.id} className={cn('flex gap-2 rounded-md p-2 pr-4 sm:max-w-[45%]', className)}>
              <UserAvatar avatar={message.user.avatar} name={message.user.name} />
              <div className="space-y-0.5">
                <p className={cn('text-xs italic', pClassName)}>{message.user.name}:</p>
                <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                <p className={cn('text-xs italic', pClassName)}>{messageCreatedAt}</p>
              </div>
            </div>
          );
        })}
      </div>
      <div ref={roomMessageScrollTargetRef} id="room-messages-scroll-target" />
    </>
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
