import ChatRoomController from '@/actions/App/Http/Controllers/ChatRoomController';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { LoadingSwap } from '@/components/ui/loading-swap';
import { useUser } from '@/hooks/use-user';
import { setServerValidationErrors } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from '@inertiajs/react';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import z from 'zod';

const createChatRoomSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'name is required.')
    .max(50, 'name is too long.')
    .regex(/^[A-Za-z0-9 _-]+$/, {
      error: 'only letters, numbers, underscores, hyphens and spaces are allowed.',
    }),
  is_public: z.boolean(),
});

export const CreateChatRoomForm = () => {
  const form = useForm<z.infer<typeof createChatRoomSchema>>({
    resolver: zodResolver(createChatRoomSchema),
    defaultValues: {
      name: '',
      is_public: true,
    },
  });
  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
    setError,
  } = form;
  const [isPending, setIsPending] = useState(false);
  const isFormDisabled = isSubmitting || isPending;
  const queryClient = useQueryClient();
  const user = useUser()!;
  return (
    <form
      className="max-w-lg"
      onSubmit={handleSubmit((data) => {
        router.post(ChatRoomController.createRoomPost(), data, {
          preserveScroll: true,
          preserveState: 'errors',
          onBefore() {
            setIsPending(true);
          },
          onFinish() {
            setIsPending(false);
          },
          onError(errors) {
            setServerValidationErrors(errors, setError);
          },
          onSuccess() {
            queryClient.refetchQueries({
              predicate(query) {
                const key = query.queryKey;

                if (!Array.isArray(key) || key.length < 2) return false;

                const [primary, params] = key;

                const isTargetPrimary = ['joined-room-list', 'public-room-list'].includes(primary);
                if (!isTargetPrimary) return false;

                if (typeof params !== 'object' || params === null) return false;

                return params.userId === user.id;
              },
            });
          },
        });
      })}
    >
      <FieldGroup className="gap-4">
        <Controller
          control={control}
          name="name"
          render={({ field, fieldState }) => {
            return (
              <Field data-invalid={fieldState.invalid} className="gap-2">
                <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                <Input {...field} id={field.name} aria-invalid={fieldState.invalid} autoComplete="on" />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            );
          }}
        />
        <Controller
          control={control}
          name="is_public"
          render={({ field: { name, onBlur, onChange, ref, value, disabled }, fieldState }) => {
            return (
              <Field orientation="horizontal" data-invalid={fieldState.invalid} className="gap-2">
                <Checkbox
                  name={name}
                  onBlur={onBlur}
                  onCheckedChange={onChange}
                  ref={ref}
                  checked={value}
                  disabled={disabled}
                  id={name}
                  aria-invalid={fieldState.invalid}
                />
                <FieldContent>
                  <FieldLabel htmlFor={name}>Is Public?</FieldLabel>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </FieldContent>
              </Field>
            );
          }}
        />
        <Button type="submit" disabled={isFormDisabled} className="self-start">
          <LoadingSwap isLoading={isFormDisabled}>Create</LoadingSwap>
        </Button>
      </FieldGroup>
    </form>
  );
};
