import { BaseLayout } from '@/components/layout/base';
import { generateTitle } from '@/lib/utils';
import type { Room } from '@/types';
import { Head } from '@inertiajs/react';
import type { ReactNode } from 'react';

export default function ShowRoom({ room: { data: room } }: { room: { data: Room } }) {
  return (
    <>
      <Head>
        <title>{generateTitle(room.name)}</title>
      </Head>
      <div className="space-y-4 p-4 px-8"></div>
    </>
  );
}

ShowRoom.layout = (page: ReactNode) => <BaseLayout>{page}</BaseLayout>;
