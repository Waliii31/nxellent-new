import React, { useState, useEffect } from "react";
import { Trash2, AlertCircle, CheckCircle2 } from "lucide-react";
import GlowCard from "../../ui/GlowCard";
import PrimaryButton from "../../ui/PrimaryButton";
import FieldPill from "../../ui/FieldPill";
import {
  useUserProfile,
  useAccountInfo,
  useUpdateEmail,
  useUpdatePassword,
  useDeleteAccount,
} from "../../../hooks/api/useUser";

const sectionTitle =
  "text-[18px] sm:text-[20px] md:text-[22px] text-white urbanist font-medium";
const sectionSub = "text-[12.5px] sm:text-[13px] inter text-white/70";

export default function AccountSettings(): React.ReactElement {
  // Fetch user data
  const { data: userProfile, isLoading: isLoadingProfile } = useUserProfile();
  const { data: accountInfo, isLoading: isLoadingAccount } = useAccountInfo();

  // Mutations
  const updateEmail = useUpdateEmail();
  const updatePassword = useUpdatePassword();
  const deleteAccount = useDeleteAccount();

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  // Email form state
  const [newEmail, setNewEmail] = useState("");
  const [emailPassword, setEmailPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [emailSuccess, setEmailSuccess] = useState("");

  // Delete account state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [deleteError, setDeleteError] = useState("");

  // Initialize email field with current user email
  useEffect(() => {
    if (userProfile?.email) {
      setNewEmail(userProfile.email);
    }
  }, [userProfile]);

  // Handle password update
  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    // Validation
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setPasswordError("All password fields are required");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters");
      return;
    }

    try {
      await updatePassword.mutateAsync({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
        confirmPassword: passwordForm.confirmPassword,
      });
      setPasswordSuccess("Password updated successfully!");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      setPasswordError(err?.response?.data?.message || "Failed to update password");
    }
  };

  // Handle email update
  const handleEmailUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError("");
    setEmailSuccess("");

    // Validation
    if (!newEmail || newEmail === userProfile?.email) {
      setEmailError("Please enter a new email address");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    if (!emailPassword) {
      setEmailError("Password is required to update email");
      return;
    }

    try {
      await updateEmail.mutateAsync({ newEmail, currentPassword: emailPassword });
      setEmailSuccess("Email updated successfully!");
      setEmailPassword("");
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      setEmailError(err?.response?.data?.message || "Failed to update email");
    }
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    setDeleteError("");

    if (!deletePassword) {
      setDeleteError("Password is required to delete account");
      return;
    }

    if (deleteConfirmation.toLowerCase() !== "delete") {
      setDeleteError("Please type DELETE to confirm");
      return;
    }

    try {
      await deleteAccount.mutateAsync({ password: deletePassword, confirmation: deleteConfirmation });
      // User will be redirected by the hook
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      setDeleteError(err?.response?.data?.message || "Failed to delete account");
    }
  };

  const isLoading = isLoadingProfile || isLoadingAccount;

  return (
    <main
      style={{
        background: "url(/auth-page.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
      className="min-h-screen pb-20"
    >
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-0 space-y-6 sm:space-y-8 lg:space-y-9 pt-6 sm:pt-8">
        {/* Change Password */}
        <GlowCard className="relative overflow-hidden">
          <div className="pointer-events-none absolute -inset-0.5 rounded-[22px] ring-2 ring-[#B56CFF]/40 blur-md -z-10" />
          <h3 className={sectionTitle}>Change Password</h3>
          <p className={sectionSub}>Update your account password</p>

          {/* Show message if user has no password (OAuth only) */}
          {accountInfo && !accountInfo.hasPassword && (
            <div className="mt-4 p-3 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-start gap-2">
              <AlertCircle size={16} className="text-blue-400 mt-0.5 shrink-0" />
              <p className="text-sm text-blue-300">
                You signed up with {accountInfo.oauthProviders?.join(", ")}. Set a password to enable email/password login.
              </p>
            </div>
          )}

          <form onSubmit={handlePasswordUpdate} className="mt-5 sm:mt-6 space-y-4">
            {accountInfo?.hasPassword && (
              <div className="text-left">
                <FieldPill
                  label="Current Password"
                  placeholder="Enter current password"
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                />
              </div>
            )}

            <div className="text-left">
              <FieldPill
                label="New Password"
                placeholder="Enter new password (min 8 characters)"
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              />
            </div>

            <div className="text-left flex flex-col sm:flex-row sm:items-end sm:justify-center gap-3">
              <div className="flex-1 w-full">
                <FieldPill
                  label="Confirm New Password"
                  placeholder="Confirm new password"
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                />
              </div>
              <PrimaryButton
                type="submit"
                disabled={updatePassword.isPending}
              >
                {updatePassword.isPending ? "Updating..." : "Update Password"}
              </PrimaryButton>
            </div>

            {/* Error/Success Messages */}
            {passwordError && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                <AlertCircle size={16} className="text-red-400 mt-0.5 shrink-0" />
                <p className="text-sm text-red-300">{passwordError}</p>
              </div>
            )}
            {passwordSuccess && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/30">
                <CheckCircle2 size={16} className="text-green-400 mt-0.5 shrink-0" />
                <p className="text-sm text-green-300">{passwordSuccess}</p>
              </div>
            )}
          </form>
        </GlowCard>

        {/* Account Information */}
        <GlowCard className="relative overflow-hidden">
          <div className="pointer-events-none absolute -inset-0.5 rounded-[22px] ring-2 ring-[#B56CFF]/40 blur-md -z-10" />
          <h3 className={sectionTitle}>Account Information</h3>
          <p className={sectionSub}>Update your account details</p>

          <form onSubmit={handleEmailUpdate} className="mt-2 space-y-4">
            <div className="text-left">
              <FieldPill
                label="Email Address"
                placeholder="Enter new email address"
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="text-left flex flex-col sm:flex-row sm:items-end sm:justify-center gap-3">
              <div className="flex-1 w-full">
                <FieldPill
                  label="Current Password"
                  placeholder="Enter password to confirm"
                  type="password"
                  value={emailPassword}
                  onChange={(e) => setEmailPassword(e.target.value)}
                />
              </div>
              <PrimaryButton
                type="submit" shrink-0
                disabled={updateEmail.isPending || isLoading}
              >
                {updateEmail.isPending ? "Updating..." : "Update Email"}
              </PrimaryButton>
            </div>

            {/* Error/Success Messages */}
            {emailError && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                <AlertCircle size={16} className="text-red-400 mt-0.5 shrink-0" />
                <p className="text-sm text-red-300">{emailError}</p>
              </div>
            )}
            {emailSuccess && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/30">
                <CheckCircle2 size={16} className="text-green-400 mt-0.5 shrink-0" />
                <p className="text-sm text-green-300">{emailSuccess}</p>
              </div>
            )}
          </form>
        </GlowCard>

        {/* Danger Zone */}
        <GlowCard className="relative overflow-hidden ring-1 ring-[#FF3B30]/10">
          <div className="pointer-events-none absolute -inset-0.5 rounded-[22px] ring-2 ring-[#B56CFF]/40 blur-md -z-10" />

          <div className="flex items-center gap-2 text-[#FF4B3E]">
            <Trash2 size={18} />
            <h3 className="text-[18px] sm:text-[20px] md:text-[22px] urbanist font-medium">
              Delete Account
            </h3>
          </div>
          <p className={sectionSub}>
            Permanently delete your account and all data
          </p>

          <div className="relative w-full rounded-2xl bg-[#000124] mt-4 py-5 sm:py-6 px-4 sm:px-6 flex flex-col sm:flex-row justify-start items-start sm:items-center gap-3 overflow-hidden">
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-linear-to-r from-[#3F84B9] to-[#D467B9]" />
            <Trash2 size={16} className="mt-0.5 text-white/60" />
            <p className="font-normal text-sm text-[#A19DAF] leading-relaxed">
              This action cannot be undone. All your projects, scans, and account data will be permanently deleted.
            </p>
          </div>

          {/* Big delete button */}
          <div className="mt-5 rounded-xl border border-[#8A2626] bg-[#BF33334D] px-4 sm:px-5 py-4 sm:py-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-center sm:text-left">
                <h1 className="text-base sm:text-lg text-[#F04141] jakarta">
                  Delete Account
                </h1>
                <p className="text-[#A19DAF] text-xs sm:text-sm jakarta font-normal">
                  Permanently delete this account and all associated data
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowDeleteConfirm(!showDeleteConfirm)}
                className="w-full sm:w-auto h-11 rounded-full px-4 text-sm font-medium text-white bg-linear-to-r from-[#F04141] to-[#C11D1D] flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
              >
                <Trash2 size={16} />
                Delete Account
              </button>
            </div>

            {/* Confirmation Dialog */}
            {showDeleteConfirm && (
              <div className="mt-4 p-4 rounded-lg bg-[#1A0A0A] border border-red-500/30 space-y-3">
                <p className="text-sm text-red-300 font-medium">
                  ⚠️ Are you absolutely sure? This action cannot be undone.
                </p>
                <div className="text-left">
                  <FieldPill
                    label="Enter your password to confirm"
                    placeholder="Password"
                    type="password"
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                  />
                </div>
                <div className="text-left">
                  <FieldPill
                    label="Type DELETE to confirm"
                    placeholder="DELETE"
                    type="text"
                    value={deleteConfirmation}
                    onChange={(e) => setDeleteConfirmation(e.target.value)}
                  />
                </div>
                {deleteError && (
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                    <AlertCircle size={16} className="text-red-400 mt-0.5 shrink-0" />
                    <p className="text-sm text-red-300">{deleteError}</p>
                  </div>
                )}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setDeletePassword("");
                      setDeleteConfirmation("");
                      setDeleteError("");
                    }}
                    className="flex-1 h-10 rounded-full px-4 text-sm font-medium text-white bg-white/10 hover:bg-white/20 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteAccount}
                    disabled={deleteAccount.isPending || !deletePassword || deleteConfirmation.toLowerCase() !== "delete"}
                    className="flex-1 h-10 rounded-full px-4 text-sm font-medium text-white bg-linear-to-r from-[#F04141] to-[#C11D1D] hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deleteAccount.isPending ? "Deleting..." : "Yes, Delete My Account"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </GlowCard>
      </section>
    </main >
  );
}
