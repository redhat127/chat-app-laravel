import type { User } from '@/types';

export const UserAvatar = ({ avatar, name }: Pick<User, 'avatar' | 'name'>) => {
  return (
    <div className="h-8 w-8 min-w-8 overflow-hidden rounded-full">
      {avatar ? (
        <img src={avatar} alt={`${name} avatar`} className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-orange-600 text-white capitalize">{name[0]}</div>
      )}
    </div>
  );
};
