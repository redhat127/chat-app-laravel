export interface User {
  id: string;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
  provider_name: string | null;
  avatar: string | null;
  is_password_null: boolean;
}

export interface Room {
  id: string;
  name: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  user_id: string;
  members_count: number;
}

export type flashMessage = {
  type: 'error' | 'success';
  text: string;
} | null;
