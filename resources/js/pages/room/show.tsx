import { JoinRoomForm } from '@/components/form/chat-room/join-room-form';
import { SendMessageForm } from '@/components/form/message/send-message-form';
import { BaseLayout } from '@/components/layout/base';
import { MessageList } from '@/components/message/message-list';
import { MessageListSkeleton } from '@/components/message/message-list-skeleton';
import { LeaveRoomForm } from '@/components/room/leave-room-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn, generateTitle } from '@/lib/utils';
import { home } from '@/routes';
import type { Message, Room } from '@/types';
import { Deferred, Head, Link } from '@inertiajs/react';
import { CircleAlert } from 'lucide-react';
import { useLayoutEffect, useRef, type ReactNode } from 'react';

export default function ShowRoom({
  roomData: {
    room: { data: room },
    currentUserIsCreator,
    currentUserIsMember,
  },
  messages,
}: {
  roomData: { room: { data: Room }; currentUserIsMember: boolean; currentUserIsCreator: boolean };
  messages?: { data: Message[] };
}) {
  const messagesCardOuterDivRef = useRef<HTMLDivElement>(null);
  const messagesCardRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const messagesCardOuterDiv = messagesCardOuterDivRef.current;
    const messagesCard = messagesCardRef.current;
    if (!messagesCard || !messagesCardOuterDiv) return;
    const updateHeight = () => {
      const outerDivPaddingTop = parseFloat(getComputedStyle(messagesCardOuterDiv).paddingTop);
      messagesCard.style.height = `${window.innerHeight - messagesCard.getBoundingClientRect().top - outerDivPaddingTop}px`;
    };
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);
  return (
    <>
      <Head>
        <title>{generateTitle(room.name)}</title>
      </Head>
      <div className="space-y-4 p-4 px-8" ref={messagesCardOuterDivRef}>
        <Card>
          <CardHeader>
            <CardTitle>
              <h1 className="flex items-center gap-2 text-2xl font-bold capitalize">
                <span>{room.name}</span>
                {currentUserIsCreator && (
                  <Tooltip>
                    <TooltipTrigger>
                      <CircleAlert size={16} />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>You created this room.</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </h1>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!currentUserIsCreator ? (
              currentUserIsMember ? (
                <LeaveRoomForm roomId={room.id} btnClassName="w-auto" />
              ) : (
                <JoinRoomForm roomId={room.id} btnClassName="w-auto" />
              )
            ) : null}
            <Link href={home()} className={cn('block text-sm underline underline-offset-4', { 'mt-4': !currentUserIsCreator })}>
              Back to chat rooms
            </Link>
          </CardContent>
        </Card>
        <Card ref={messagesCardRef} className="py-4">
          <CardContent className="flex-1 overflow-y-auto">
            <Deferred data="messages" fallback={<MessageListSkeleton />}>
              {messages?.data && <MessageList messages={messages.data} />}
            </Deferred>
          </CardContent>
          <SendMessageForm currentUserIsMember={currentUserIsMember} roomId={room.id} />
        </Card>
      </div>
    </>
  );
}

ShowRoom.layout = (page: ReactNode) => <BaseLayout>{page}</BaseLayout>;
