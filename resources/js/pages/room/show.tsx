import { JoinRoomForm } from '@/components/form/chat-room/join-room-form';
import { SendMessageForm } from '@/components/form/message/send-message-form';
import { BaseLayout } from '@/components/layout/base';
import { MessageList } from '@/components/message/message-list';
import { LeaveRoomForm } from '@/components/room/leave-room-form';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { generateTitle } from '@/lib/utils';
import { home } from '@/routes';
import type { Message, Room } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { useEcho } from '@laravel/echo-react';
import { useQueryClient } from '@tanstack/react-query';
import { CircleAlert, Ellipsis } from 'lucide-react';
import { useEffect, type ReactNode } from 'react';

export default function ShowRoom({
  room: { data: room },
  currentUserIsCreator,
  currentUserIsMember,
}: {
  room: { data: Room };
  currentUserIsMember: boolean;
  currentUserIsCreator: boolean;
}) {
  const queryClient = useQueryClient();
  const { leave } = useEcho<{ new_message: Message }>('room.' + room.id, 'BroadcastMessageEvent', (data) => {
    queryClient.setQueryData<Message[]>(['messages', { roomId: room.id }], (messages = []) => {
      return [...messages, data.new_message];
    });
  });

  useEffect(() => {
    return router.on('success', function (event) {
      if (event.detail.page.url !== window.location.pathname) {
        leave();
      }
    });
  }, [leave]);

  return (
    <>
      <Head>
        <title>{generateTitle(room.name)}</title>
      </Head>
      <div className="mb-38 space-y-4 p-4 px-8">
        <Card className="rounded-md py-2">
          <CardHeader className="flex items-center justify-between gap-4">
            <div>
              <CardTitle>
                <h1 className="flex items-center gap-2 font-bold capitalize">
                  <span className="leading-normal">{room.name}</span>
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
              <p>
                <Link href={home()} className="text-sm font-normal text-muted-foreground underline underline-offset-4">
                  Back to chat rooms
                </Link>
              </p>
            </div>
            {!currentUserIsCreator ? (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Ellipsis />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    {currentUserIsMember ? (
                      <LeaveRoomForm roomId={room.id} useAsDropDownMenuItem />
                    ) : (
                      <JoinRoomForm roomId={room.id} useAsDropDownMenuItem />
                    )}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : null}
          </CardHeader>
        </Card>
        <MessageList roomId={room.id} />
      </div>
      <SendMessageForm currentUserIsMember={currentUserIsMember} roomId={room.id} />
    </>
  );
}

ShowRoom.layout = (page: ReactNode) => <BaseLayout>{page}</BaseLayout>;
