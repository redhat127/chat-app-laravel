import { LoginForm } from '@/components/form/login-form';
import { BaseLayout } from '@/components/layout/base';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@/hooks/use-user';
import { GithubIcon } from '@/icons/github';
import { GoogleIcon } from '@/icons/google';
import { generateTitle } from '@/lib/utils';
import login from '@/routes/login';
import { Head } from '@inertiajs/react';
import type { ReactNode } from 'react';

export default function Home() {
  const user = useUser();
  return (
    <>
      <Head>
        <title>{generateTitle('Real-time messaging')}</title>
      </Head>
      {!user && (
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
      )}
    </>
  );
}

Home.layout = (page: ReactNode) => <BaseLayout>{page}</BaseLayout>;
