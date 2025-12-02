import { cn } from '@/lib/utils';
import { Skeleton } from '../ui/skeleton';

export const MessageListSkeleton = ({ count = 4 }: { count?: number }) => {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: count }).map((_, idx) => {
        const isMine = idx % 2 !== 0;
        const className = isMine ? 'self-end bg-sky-600' : 'self-start border bg-gray-100';
        const skeletonClassName = isMine ? 'bg-sky-500' : 'bg-gray-300';
        return (
          <div key={`skeleton-${idx}`} className={cn('space-y-1 rounded-md px-4 py-2', className)}>
            <Skeleton className={cn('h-3 w-10 rounded', skeletonClassName)} />
            <Skeleton className={cn('h-4 w-20 rounded', skeletonClassName)} />
            <Skeleton className={cn('h-3 w-10 rounded', skeletonClassName)} />
          </div>
        );
      })}
    </div>
  );
};
