import ChatRoomController from '@/actions/App/Http/Controllers/ChatRoomController';
import { LoginForm } from '@/components/form/login-form';
import { BaseLayout } from '@/components/layout/base';
import { RoomList } from '@/components/room/room-list';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useUser } from '@/hooks/use-user';
import { GithubIcon } from '@/icons/github';
import { GoogleIcon } from '@/icons/google';
import { generateTitle } from '@/lib/utils';
import login from '@/routes/login';
import type { Room } from '@/types';
import { Deferred, Head, Link } from '@inertiajs/react';
import type { ReactNode } from 'react';

const RoomListSkeleton = () => {
  return (
    <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))' }}>
      {[...Array(4)].map((_, i) => (
        <Skeleton key={i} className="h-40 w-full rounded-lg" />
      ))}
    </div>
  );
};

export default function Home(props: { publicRooms?: { data: Room[] } | null; joinedRooms?: { data: Room[] } } | null) {
  const user = useUser();
  const publicRooms = props?.publicRooms?.data;
  const joinedRooms = props?.joinedRooms?.data;
  return (
    <>
      <Head>
        <title>{generateTitle('Real-time messaging')}</title>
      </Head>
      {!user ? (
        <div className="flex min-h-screen items-center justify-center">
          <div className="w-full p-4 px-8">
            <Card className="mx-auto max-w-md">
              <CardHeader>
                <CardTitle>
                  <h1 className="text-2xl font-bold">Login</h1>
                </CardTitle>
                <CardDescription>Use your email and password to login</CardDescription>
              </CardHeader>
              <CardContent>
                <LoginForm />
                <div className="mt-4 flex flex-col gap-2">
                  <Button asChild>
                    <a href={login.provider.redirect.url({ provider: 'github' })}>
                      <GithubIcon />
                      Continue with Github
                    </a>
                  </Button>
                  <Button asChild variant="orange">
                    <a href={login.provider.redirect.url({ provider: 'google' })}>
                      <GoogleIcon />
                      Continue with Google
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <div className="space-y-4 p-4 px-8">
          <Card className="gap-4">
            <CardHeader>
              <CardTitle>
                <h1 className="text-2xl font-bold">Chat Rooms</h1>
              </CardTitle>
              <CardDescription>View all public rooms and rooms you’ve joined</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href={ChatRoomController.createRoom()}>Create a new Room</Link>
              </Button>
            </CardContent>
          </Card>
          <Card className="gap-4">
            <CardHeader>
              <CardTitle>
                <h2 className="text-xl font-bold">Joined Rooms</h2>
              </CardTitle>
              <CardDescription>Rooms you're currently a member of</CardDescription>
            </CardHeader>
            <CardContent>
              <Deferred data="joinedRooms" fallback={RoomListSkeleton}>
                {joinedRooms && joinedRooms.length > 0 ? (
                  <RoomList rooms={joinedRooms} forJoinedRooms user={user} />
                ) : (
                  <p className="text-sm text-muted-foreground">No rooms found.</p>
                )}
              </Deferred>
            </CardContent>
          </Card>
          <Card className="gap-4">
            <CardHeader>
              <CardTitle>
                <h2 className="text-xl font-bold">Public Rooms</h2>
              </CardTitle>
              <CardDescription>Join public rooms from the community</CardDescription>
            </CardHeader>
            <CardContent>
              <Deferred data="publicRooms" fallback={RoomListSkeleton}>
                {publicRooms && publicRooms.length > 0 ? (
                  <RoomList rooms={publicRooms.filter((room) => !joinedRooms?.some((r) => r.id === room.id))} />
                ) : (
                  <p className="text-sm text-muted-foreground">No rooms found.</p>
                )}
              </Deferred>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}

Home.layout = (page: ReactNode) => <BaseLayout>{page}</BaseLayout>;
