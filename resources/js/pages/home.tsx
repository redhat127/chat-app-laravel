import { BaseLayout } from '@/components/layout/base';
import { Button } from '@/components/ui/button';
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
          <div className="mx-auto flex max-w-xl flex-col gap-2 p-4">
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
        </div>
      )}
    </>
  );
}

Home.layout = (page: ReactNode) => <BaseLayout>{page}</BaseLayout>;
