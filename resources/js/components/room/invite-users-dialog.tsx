import room from '@/routes/room';
import { Check, Copy } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';

export const InviteUserModal = ({ roomId, open, onOpenChange }: { roomId: string; open: boolean; onOpenChange: (open: boolean) => void }) => {
  const [copied, setCopied] = useState(false);

  const inviteLink = `${window.location.origin}${room.joinWithInvitation.url({ roomId })}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader className="gap-0">
          <DialogTitle className="text-base font-bold">Invite Users</DialogTitle>
          <DialogDescription>You can use the link below to invite users to join this room</DialogDescription>
        </DialogHeader>
        <div className="flex gap-2">
          <Input value={inviteLink} readOnly name="invite-link" />
          <Button onClick={handleCopy} size="sm" variant="outline">
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
