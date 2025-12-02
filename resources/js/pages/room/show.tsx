import { JoinRoomForm } from '@/components/form/chat-room/join-room-form';
import { BaseLayout } from '@/components/layout/base';
import { LeaveRoomForm } from '@/components/room/leave-room-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn, generateTitle } from '@/lib/utils';
import { home } from '@/routes';
import type { Room } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { CircleAlert } from 'lucide-react';
import { type ReactNode } from 'react';

export default function ShowRoom({
  room: { data: room },
  currentUserIsMember,
  currentUserIsCreator,
}: {
  room: { data: Room };
  currentUserIsMember: boolean;
  currentUserIsCreator: boolean;
}) {
  return (
    <>
      <Head>
        <title>{generateTitle(room.name)}</title>
      </Head>
      <div className="space-y-4 p-4 px-8">
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
      </div>
    </>
  );
}

ShowRoom.layout = (page: ReactNode) => <BaseLayout>{page}</BaseLayout>;
