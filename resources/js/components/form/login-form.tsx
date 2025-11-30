import LoginController from '@/actions/App/Http/Controllers/LoginController';
import { Button } from '@/components/ui/button';
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { LoadingSwap } from '@/components/ui/loading-swap';
import { PasswordInput } from '@/components/ui/password-input';
import { setServerValidationErrors } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import z from 'zod';
import { Checkbox } from '../ui/checkbox';
import { Input } from '../ui/input';

const loginSchema = z.object({
  email: z.email('valid email is required').max(50, 'email is too long.'),
  password: z.string().min(1, 'password is required.').max(50, 'password is too long.'),
  remember_me: z.boolean(),
});

export const LoginForm = () => {
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      remember_me: false,
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
        router.post(LoginController.post(), data, {
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
          name="email"
          render={({ field, fieldState }) => {
            return (
              <Field data-invalid={fieldState.invalid} className="gap-2">
                <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                <Input type="email" {...field} id={field.name} aria-invalid={fieldState.invalid} autoComplete="on" />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            );
          }}
        />
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
          name="remember_me"
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
                  <FieldLabel htmlFor={name}>Remember me?</FieldLabel>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </FieldContent>
              </Field>
            );
          }}
        />
        <Button type="submit" disabled={isFormDisabled}>
          <LoadingSwap isLoading={isFormDisabled}>Login</LoadingSwap>
        </Button>
      </FieldGroup>
    </form>
  );
};
