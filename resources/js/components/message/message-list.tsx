import { cn } from '@/lib/utils';
import type { Message } from '@/types';

export const MessageList = ({ messages }: { messages: Message[] }) => {
  return messages.length > 0 ? (
    <div className="flex flex-col gap-2">
      {messages.map((message) => {
        const className = {
          'border sm:self-start': !message.is_mine,
          'bg-sky-600 text-white sm:self-end': message.is_mine,
        };
        const pClassName = {
          'text-muted-foreground': !message.is_mine,
          'text-gray-200': message.is_mine,
        };
        const messageCreatedAt = new Date(message.created_at).toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
        });
        return (
          <div key={message.id} className={cn('max-w-1/2 space-y-1 rounded-md px-4 py-2', className)}>
            {message.user && <p className={cn('text-xs italic', pClassName)}>{message.user.name}:</p>}
            <p className="text-sm">{message.text}</p>
            <p className={cn('text-xs italic', pClassName)}>{messageCreatedAt}</p>
          </div>
        );
      })}
    </div>
  ) : (
    <p className="text-sm text-muted-foreground italic">No message found.</p>
  );
};
