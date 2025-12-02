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
import { useEcho } from '@laravel/echo-react';
import { CircleAlert } from 'lucide-react';
import { useCallback, useEffect, useState, type ReactNode } from 'react';

export default function ShowRoom({
  roomData: {
    room: { data: room },
    currentUserIsCreator,
    currentUserIsMember,
  },
  messages: serverMessages,
}: {
  roomData: { room: { data: Room }; currentUserIsMember: boolean; currentUserIsCreator: boolean };
  messages?: { data: Message[] };
}) {
  const [messages, setMessages] = useState(serverMessages?.data);

  useEffect(() => {
    setMessages(serverMessages?.data);
  }, [serverMessages?.data]);

  const addMessage = useCallback((newMessage: Message) => {
    setMessages((prev) => [...(prev || []), newMessage]);
  }, []);

  const { leave } = useEcho<{ new_message: Message }>('room.' + room.id, 'BroadcastMessageEvent', (data) => {
    addMessage(data.new_message);
  });

  useEffect(() => {
    return () => leave();
  }, [leave]);

  return (
    <>
      <Head>
        <title>{generateTitle(room.name)}</title>
      </Head>
      <div className="mb-38 space-y-4 p-4 px-8">
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
            <Link href={home()} className={cn('inline-block text-sm underline underline-offset-4', { 'mt-4': !currentUserIsCreator })}>
              Back to chat rooms
            </Link>
          </CardContent>
        </Card>
        <Deferred data="messages" fallback={<MessageListSkeleton />}>
          {messages && <MessageList messages={messages} />}
        </Deferred>
      </div>
      <SendMessageForm currentUserIsMember={currentUserIsMember} roomId={room.id} addMessage={addMessage} />
    </>
  );
}

ShowRoom.layout = (page: ReactNode) => <BaseLayout>{page}</BaseLayout>;
