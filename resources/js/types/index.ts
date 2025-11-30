export interface User {
  id: string;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
  provider_name: string | null;
  avatar: string | null;
}

export type flashMessage = {
  type: 'error' | 'success';
  text: string;
} | null;
