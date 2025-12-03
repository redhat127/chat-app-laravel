import { CreateChatRoomForm } from '@/components/form/chat-room/create-chat-room-form';
import { BaseLayout } from '@/components/layout/base';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { generateTitle } from '@/lib/utils';
import { home } from '@/routes';
import { Head, Link } from '@inertiajs/react';
import type { ReactNode } from 'react';

export default function CreateRoom() {
  return (
    <>
      <Head>
        <title>{generateTitle('Create Room')}</title>
      </Head>
      <div className="space-y-4 p-4 px-8">
        <Card className="gap-4 py-4">
          <CardHeader className="gap-1">
            <CardTitle>
              <h1 className="font-bold">Create a new Room</h1>
            </CardTitle>
            <CardDescription>Use form below to create a new chat room</CardDescription>
            <p>
              <Link href={home()} className="text-sm text-muted-foreground underline underline-offset-4">
                Back to chat rooms
              </Link>
            </p>
          </CardHeader>
          <CardContent>
            <CreateChatRoomForm />
          </CardContent>
        </Card>
      </div>
    </>
  );
}

CreateRoom.layout = (page: ReactNode) => <BaseLayout>{page}</BaseLayout>;
