// src/types/user.ts

export interface AccountInfo {
    hasPassword: boolean;
    canChangeEmail: boolean;
    canChangePassword: boolean;
    oauthProviders: string[];
}

export interface UpdateEmailDto {
    newEmail: string;
    currentPassword: string;
}

export interface UpdatePasswordDto {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export interface DeleteAccountDto {
    password: string;
    confirmation: string;
}
