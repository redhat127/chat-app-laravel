import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { generateTitle } from '@/lib/utils';
import { home } from '@/routes';
import { Head, Link } from '@inertiajs/react';

export default function ErrorPage({ statusCode, title, message }: { statusCode: number; title: string; message: string }) {
  return (
    <>
      <Head>
        <title>{generateTitle(title)}</title>
      </Head>
      <div className="flex min-h-screen items-center justify-center">
        <div className="mx-auto w-full max-w-md p-4 text-center">
          <Card className="gap-2">
            <CardHeader>
              <CardTitle>
                <h1 className="text-2xl font-bold text-red-600">
                  {statusCode} - {title}
                </h1>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {message}
              <Link href={home()} className="mt-2 block text-sm underline underline-offset-4">
                Back to home
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
