import { JoinRoomForm } from '@/components/form/chat-room/join-room-form';
import { SendMessageForm } from '@/components/form/message/send-message-form';
import { BaseLayout } from '@/components/layout/base';
import { MessageList } from '@/components/message/message-list';
import { InviteUserModal } from '@/components/room/invite-users-dialog';
import { LeaveRoomForm } from '@/components/room/leave-room-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useShowOnlineUsersCount } from '@/hooks/use-show-online-users-count';
import { useShowRealTimeMessages } from '@/hooks/use-show-realtime-messages';
import { generateTitle } from '@/lib/utils';
import { home } from '@/routes';
import type { Room } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { CircleAlert, Ellipsis, UserPlus } from 'lucide-react';
import { useState, type ReactNode } from 'react';

export default function ShowRoom({
  room: { data: room },
  currentUserIsCreator,
  currentUserIsMember,
}: {
  room: { data: Room };
  currentUserIsMember: boolean;
  currentUserIsCreator: boolean;
}) {
  useShowRealTimeMessages(room.id, 'BroadcastMessageEvent');
  const { usersCount } = useShowOnlineUsersCount(room.id);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <Head>
        <title>{generateTitle(room.name)}</title>
      </Head>
      <Card className="fixed top-4 left-1/2 -translate-x-1/2 py-2 text-xs">
        <CardContent className="flex items-center gap-1.5 px-4">
          <div className="size-1.5 animate-pulse rounded-full bg-green-600" />
          {usersCount.length} {usersCount.length === 1 ? 'Person' : 'People'} Online
        </CardContent>
      </Card>
      <div className="mb-48 space-y-4 p-4 px-8">
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
            <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
              <DropdownMenuTrigger>
                <Ellipsis />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  className="p-0"
                  onSelect={(e) => {
                    e.preventDefault();
                    if (currentUserIsCreator) {
                      setIsDialogOpen(true);
                      setIsDropdownOpen(false);
                    }
                  }}
                >
                  {!currentUserIsCreator ? (
                    currentUserIsMember ? (
                      <LeaveRoomForm roomId={room.id} useAsDropDownMenuItem />
                    ) : (
                      <JoinRoomForm roomId={room.id} useAsDropDownMenuItem />
                    )
                  ) : (
                    <div className="flex items-center gap-1.5 px-2 py-1.5">
                      <UserPlus className="text-inherit" />
                      Invite users
                    </div>
                  )}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
        </Card>
        <MessageList roomId={room.id} />
      </div>
      <InviteUserModal roomId={room.id} open={isDialogOpen} onOpenChange={setIsDialogOpen} />
      <SendMessageForm currentUserIsMember={currentUserIsMember} roomId={room.id} />
    </>
  );
}

ShowRoom.layout = (page: ReactNode) => <BaseLayout>{page}</BaseLayout>;
