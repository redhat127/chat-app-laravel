import MessageController from '@/actions/App/Http/Controllers/MessageController';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldGroup } from '@/components/ui/field';
import { LoadingSwap } from '@/components/ui/loading-swap';
import { Textarea } from '@/components/ui/textarea';
import type { Message } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { echo } from '@laravel/echo-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';

const sendMessageSchema = z.object({
  text: z.string().trim().min(1, 'text is required.').max(160, 'text is too long.'),
});

const sendMessageFn = async (text: string, roomId: string, socketId: string) => {
  const { data: new_message } = await axios.post<{ new_message: Message }>(
    MessageController.post.url({ roomId }),
    { text },
    {
      headers: {
        'X-Socket-ID': socketId,
      },
    },
  );
  return new_message;
};

export const SendMessageForm = ({ currentUserIsMember, roomId }: { currentUserIsMember: boolean; roomId: string }) => {
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
  const { mutate: sendMessage, isPending } = useMutation({
    mutationKey: ['send-message'],
    mutationFn({ text, roomId, socketId }: { text: string; roomId: string; socketId: string }) {
      return sendMessageFn(text, roomId, socketId);
    },
  });
  const isFormDisabled = isSubmitting || isPending;
  const queryClient = useQueryClient();
  return (
    <form
      className="fixed right-0 bottom-0 left-0 bg-white p-4 px-8"
      onSubmit={handleSubmit(async ({ text }) => {
        const socketId = echo().socketId();
        if (!socketId || !currentUserIsMember) return;
        sendMessage(
          { text, roomId, socketId },
          {
            onSuccess({ new_message }) {
              resetField('text');
              queryClient.setQueryData<Message[]>(['messages', { roomId }], (messages = []) => {
                return [...messages, new_message];
              });
            },
            onError(e) {
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
            },
          },
        );
      })}
    >
      <FieldGroup className="gap-4">
        <Controller
          control={control}
          name="text"
          render={({ field, fieldState }) => {
            return (
              <Field data-invalid={fieldState.invalid} className="gap-2">
                <Textarea
                  {...field}
                  aria-invalid={fieldState.invalid}
                  autoComplete="on"
                  placeholder="Type something..."
                  disabled={!currentUserIsMember}
                />
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
