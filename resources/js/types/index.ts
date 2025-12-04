export interface User {
  id: string;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
  provider_name: string;
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

export interface Message {
  id: string;
  text: string;
  chat_room_id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  is_mine: boolean;
  user: Pick<User, 'id' | 'name' | 'avatar'>;
}

export type flashMessage = {
  type: 'error' | 'success';
  text: string;
} | null;

export type PaginatedMessagesResponse = {
  messages: Message[];
  next_cursor: string | null;
};
