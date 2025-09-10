export interface ApiLoginRequest {
  email: string;
  password: string;
}

export interface ApiLoginResponse {
  user: {
    id: string;
    email: string;
    name: string;
    avatar: string;
  };
  token: string;
}
