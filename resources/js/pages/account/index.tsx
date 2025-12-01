import { ProfileDetailsForm } from '@/components/form/account/profile-details-form';
import { SetPasswordForm } from '@/components/form/account/set-password-form';
import { BaseLayout } from '@/components/layout/base';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@/hooks/use-user';
import { generateTitle } from '@/lib/utils';
import { Head } from '@inertiajs/react';
import type { ReactNode } from 'react';

export default function AccountIndex() {
  const user = useUser()!;
  return (
    <>
      <Head>
        <title>{generateTitle('Account')}</title>
      </Head>
      <div className="space-y-4 p-4 px-8">
        <Card>
          <CardHeader className="gap-0">
            <CardTitle>
              <h1 className="text-2xl font-bold">Account</h1>
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>
              <h2 className="text-xl font-bold">Profile Details</h2>
            </CardTitle>
            <CardDescription>Use form below to update your profile details</CardDescription>
          </CardHeader>
          <CardContent>
            <ProfileDetailsForm user={user} />
          </CardContent>
        </Card>
        {user.is_password_null && (
          <Card>
            <CardHeader>
              <CardTitle>
                <h2 className="text-xl font-bold">Set Password</h2>
              </CardTitle>
              <CardDescription>Use form below to set password for your account</CardDescription>
            </CardHeader>
            <CardContent>
              <SetPasswordForm />
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}

AccountIndex.layout = (page: ReactNode) => <BaseLayout>{page}</BaseLayout>;
