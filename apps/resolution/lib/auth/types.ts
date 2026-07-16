export type AdminCredentials = {
  username: string;
  password: string;
};

export interface AuthProvider {
  authenticate(credentials: AdminCredentials): Promise<boolean>;
}
