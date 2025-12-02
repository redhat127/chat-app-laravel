import MessageController from '@/actions/App/Http/Controllers/MessageController';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldGroup } from '@/components/ui/field';
import { LoadingSwap } from '@/components/ui/loading-swap';
import { Textarea } from '@/components/ui/textarea';
import type { Message } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';

const sendMessageSchema = z.object({
  text: z.string().trim().min(1, 'text is required.').max(160, 'text is too long.'),
});

export const SendMessageForm = ({
  currentUserIsMember,
  roomId,
  addMessage,
}: {
  currentUserIsMember: boolean;
  roomId: string;
  addMessage(newMessage: Message): void;
}) => {
  const form = useForm<z.infer<typeof sendMessageSchema>>({
    resolver: zodResolver(sendMessageSchema),
    defaultValues: {
      text: '',
    },
  });
  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
    resetField,
    setError,
  } = form;
  const [isPending, setIsPending] = useState(false);
  const isFormDisabled = isSubmitting || isPending;
  return (
    <form
      className="mx-4"
      onSubmit={handleSubmit(async ({ text }) => {
        try {
          setIsPending(true);
          const { data } = await axios.post<{ new_message: Message }>(MessageController.post.url({ roomId: roomId }), { text });
          resetField('text');
          addMessage(data.new_message);
        } catch (e) {
          if (e instanceof AxiosError) {
            const data = e.response?.data;
            if (e.status === 422) {
              const result = z.object({ errors: z.object({ text: z.array(z.string()).optional() }) }).safeParse(data);
              if (result.success) {
                const message = result.data.errors.text?.[0];
                if (message) {
                  setError('text', { message });
                }
              }
              return;
            }
            if ('flashMessage' in data) {
              const result = z
                .object({
                  flashMessage: z.object({
                    type: z.literal(['error']),
                    text: z.string(),
                  }),
                })
                .safeParse(data);
              if (result.success) {
                const { flashMessage } = result.data;
                toast[flashMessage.type](flashMessage.text);
              }
              return;
            }
            toast.error('Something went wrong. Please try again.');
          }
        } finally {
          setIsPending(false);
        }
      })}
    >
      <FieldGroup className="gap-4">
        <Controller
          control={control}
          name="text"
          render={({ field, fieldState }) => {
            return (
              <Field data-invalid={fieldState.invalid} className="gap-2">
                <Textarea {...field} aria-invalid={fieldState.invalid} autoComplete="on" placeholder="Type something..." />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            );
          }}
        />
        <Button type="submit" className="w-full" disabled={!currentUserIsMember || isFormDisabled}>
          {!currentUserIsMember ? 'You must join the room before you can send messages' : <LoadingSwap isLoading={isFormDisabled}>Send</LoadingSwap>}
        </Button>
      </FieldGroup>
    </form>
  );
};
