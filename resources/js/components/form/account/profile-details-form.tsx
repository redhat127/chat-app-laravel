import AccountController from '@/actions/App/Http/Controllers/AccountController';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { LoadingSwap } from '@/components/ui/loading-swap';
import { setServerValidationErrors } from '@/lib/utils';
import type { User } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import z from 'zod';

const profileDetailsSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'name is required.')
    .max(50, 'name is too long.')
    .regex(/^[A-Za-z0-9 _-]+$/, {
      error: 'only letters, numbers, underscores, hyphens and spaces are allowed.',
    }),
});

export const ProfileDetailsForm = ({ user: { name } }: { user: User }) => {
  const form = useForm<z.infer<typeof profileDetailsSchema>>({
    resolver: zodResolver(profileDetailsSchema),
    defaultValues: {
      name,
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
  return (
    <form
      className="max-w-lg"
      onSubmit={handleSubmit((data) => {
        router.post(AccountController.profileDetails(), data, {
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
        <Button type="submit" disabled={isFormDisabled} className="self-start">
          <LoadingSwap isLoading={isFormDisabled}>Update</LoadingSwap>
        </Button>
      </FieldGroup>
    </form>
  );
};
