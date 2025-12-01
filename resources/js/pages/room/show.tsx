import { JoinRoomForm } from '@/components/form/chat-room/join-room-form';
import { BaseLayout } from '@/components/layout/base';
import { LeaveRoomForm } from '@/components/room/leave-room-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn, generateTitle } from '@/lib/utils';
import { home } from '@/routes';
import type { Room } from '@/types';
import { Head, Link } from '@inertiajs/react';
import type { ReactNode } from 'react';

export default function ShowRoom({
  room: { data: room },
  isCurrentUserMember,
  isRoomCreator,
}: {
  room: { data: Room };
  isCurrentUserMember: boolean;
  isRoomCreator: boolean;
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
              <h1 className="text-2xl font-bold capitalize">{room.name}</h1>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!isRoomCreator ? (
              isCurrentUserMember ? (
                <LeaveRoomForm roomId={room.id} btnClassName="w-auto" />
              ) : (
                <JoinRoomForm roomId={room.id} btnClassName="w-auto" />
              )
            ) : null}
            <Link href={home()} className={cn('block text-sm underline underline-offset-4', { 'mt-4': !isRoomCreator })}>
              Back to chat rooms
            </Link>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

ShowRoom.layout = (page: ReactNode) => <BaseLayout>{page}</BaseLayout>;
