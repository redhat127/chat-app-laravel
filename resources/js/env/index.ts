import z from 'zod';

export const clientEnvs = z
  .object({
    VITE_APP_NAME: z.string(),
  })
  .parse(import.meta.env);
