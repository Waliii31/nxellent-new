// src/hooks/api/useUser.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../services/api";
import type { User } from "../../types/auth";
import type {
    AccountInfo,
    UpdateEmailDto,
    UpdatePasswordDto,
    DeleteAccountDto,
} from "../../types/user";

/**
 * Get current user profile with full details
 * GET /users/profile
 */
export const useUserProfile = () =>
    useQuery<User>({
        queryKey: ["user-profile"],
        queryFn: () => api.get<User>("/users/profile").then((r) => r.data),
    });

/**
 * Get account info (password status, OAuth providers)
 * GET /users/account-info
 */
export const useAccountInfo = () =>
    useQuery<AccountInfo>({
        queryKey: ["account-info"],
        queryFn: () => api.get<AccountInfo>("/users/account-info").then((r) => r.data),
    });

/**
 * Get user by ID
 * GET /users/:id
 */
export const useUser = (userId?: string) =>
    useQuery<User>({
        queryKey: ["user", userId],
        enabled: !!userId,
        queryFn: () => api.get<User>(`/users/${userId}`).then((r) => r.data),
    });

/**
 * Update email address
 * PUT /users/email
 */
export const useUpdateEmail = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateEmailDto) =>
            api.put("/users/email", data).then((r) => r.data),
        onSuccess: () => {
            // Invalidate user profile and account info to refetch updated data
            queryClient.invalidateQueries({ queryKey: ["user-profile"] });
            queryClient.invalidateQueries({ queryKey: ["me"] });
            queryClient.invalidateQueries({ queryKey: ["account-info"] });
        },
    });
};

/**
 * Update password
 * PUT /users/password
 */
export const useUpdatePassword = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdatePasswordDto) =>
            api.put("/users/password", data).then((r) => r.data),
        onSuccess: () => {
            // Invalidate account info to refetch updated password status
            queryClient.invalidateQueries({ queryKey: ["account-info"] });
        },
    });
};

/**
 * Delete user account
 * DELETE /users/account
 */
export const useDeleteAccount = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: DeleteAccountDto) =>
            api.delete("/users/account", { data }).then((r) => r.data),
        onSuccess: () => {
            // Clear all cached data and redirect to login
            queryClient.clear();
            localStorage.removeItem("nxellent_access_token");
            localStorage.removeItem("nx_token");
            // Optionally redirect to home or login page
            window.location.href = "/";
        },
    });
};
