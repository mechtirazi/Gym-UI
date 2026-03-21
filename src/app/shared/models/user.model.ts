export interface User {
  id_user: string;
  name: string;
  last_name: string;
  email: string;
  phone: string;
  role: 'admin' | 'staff' | 'member' | 'owner';
  gym_id?: number;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    access_token: string;
    token_type: string;
    user: User;
  };
}
