import ChatRoomController from '@/actions/App/Http/Controllers/ChatRoomController';
import { LoginForm } from '@/components/form/login-form';
import { BaseLayout } from '@/components/layout/base';
import { JoinedRoomList } from '@/components/room/joined-room-list';
import { PublicRoomList } from '@/components/room/public-room-list';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@/hooks/use-user';
import { GithubIcon } from '@/icons/github';
import { GoogleIcon } from '@/icons/google';
import { generateTitle } from '@/lib/utils';
import login from '@/routes/login';
import { Head, Link } from '@inertiajs/react';
import type { ReactNode } from 'react';

export default function Home() {
  const user = useUser();
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
              <JoinedRoomList user={user} />
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
              <PublicRoomList userId={user.id} />
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}

Home.layout = (page: ReactNode) => <BaseLayout>{page}</BaseLayout>;
