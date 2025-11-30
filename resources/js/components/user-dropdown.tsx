import type { User } from '@/types';
import { useMemo } from 'react';
import { LogoutForm } from './form/logout-form';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

export const UserDropdown = ({ user: { name, avatar, email } }: { user: User }) => {
  const userInitials = useMemo(() => {
    return (
      <div className="h-8 w-8 overflow-hidden rounded-full">
        {avatar ? (
          <img src={avatar} alt={`${name} avatar`} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-orange-600 text-white capitalize">{name[0]}</div>
        )}
      </div>
    );
  }, [avatar, name]);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>{userInitials}</DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel className="flex items-center gap-2">
          {userInitials}
          <div className="flex max-w-30 flex-col">
            <span className="truncate">{name}</span>
            <span className="truncate text-sm font-normal text-muted-foreground">{email}</span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="p-0">
          <LogoutForm />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
