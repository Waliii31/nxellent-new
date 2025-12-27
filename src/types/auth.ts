// src/types/auth.ts

export type UserRole = "founder" | "auditor" | "admin" | string;

export interface UserProfile {
  name: string;
  company?: string;
  avatar?: string;
}

export interface GithubOAuthInfo {
  id: string;
  username: string;
}

export interface UserOAuth {
  github?: GithubOAuthInfo;
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  profile: UserProfile;
  oauth?: UserOAuth;
}

export interface AuthResponseDto {
  access_token: string;
  user: User;
}

export interface RegisterDto {
  email: string;
  password: string;
  role: UserRole;
  profile: {
    name: string;
    company?: string;
  };
}

export interface LoginDto {
  email: string;
  password: string;
}
