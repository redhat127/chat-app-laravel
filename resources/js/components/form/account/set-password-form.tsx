import AccountController from '@/actions/App/Http/Controllers/AccountController';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { LoadingSwap } from '@/components/ui/loading-swap';
import { PasswordInput } from '@/components/ui/password-input';
import { setServerValidationErrors } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import z from 'zod';

const setPasswordSchema = z
  .object({
    password: z.string().min(10, 'minimum for password is 10 characters.').max(50, 'password is too long.'),
    password_confirmation: z.string().min(10, 'minimum for password confirmation is 10 characters.').max(50, 'password confirmation is too long.'),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'password and password confirmation are not the same.',
    path: ['password_confirmation'],
  });

export const SetPasswordForm = () => {
  const form = useForm<z.infer<typeof setPasswordSchema>>({
    resolver: zodResolver(setPasswordSchema),
    defaultValues: {
      password: '',
      password_confirmation: '',
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
        router.post(AccountController.setPassword(), data, {
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
          name="password"
          render={({ field, fieldState }) => {
            return (
              <Field data-invalid={fieldState.invalid} className="gap-2">
                <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                <PasswordInput {...field} id={field.name} aria-invalid={fieldState.invalid} autoComplete="on" />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            );
          }}
        />
        <Controller
          control={control}
          name="password_confirmation"
          render={({ field, fieldState }) => {
            return (
              <Field data-invalid={fieldState.invalid} className="gap-2">
                <FieldLabel htmlFor={field.name}>Password Confirmation</FieldLabel>
                <PasswordInput {...field} id={field.name} aria-invalid={fieldState.invalid} autoComplete="on" />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            );
          }}
        />
        <Button type="submit" disabled={isFormDisabled} className="self-start">
          <LoadingSwap isLoading={isFormDisabled}>Set</LoadingSwap>
        </Button>
      </FieldGroup>
    </form>
  );
};
