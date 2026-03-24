import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Key,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Calendar,
  CreditCard,
  LogOut,
  User,
} from "lucide-react";
import Navbar from "../components/sections/Navbar";
import PrimaryButton from "../components/ui/PrimaryButton";
import {
  useCurrentUser,
  useLogout,
} from "../hooks/api/useAuth";
import {
  useUserProfile,
  useAccountInfo,
  useUpdateEmail,
  useUpdatePassword,
  useDeleteAccount,
} from "../hooks/api/useUser";
import { useSubscriptionStatus } from "../hooks/api/useSubscription";

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const logout = useLogout();
  const { data: currentUser } = useCurrentUser();
  useUserProfile();
  const { data: accountInfo } = useAccountInfo();
  const { data: subscription } = useSubscriptionStatus();

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

  // Initialize email field
  useEffect(() => {
    if (currentUser?.email) {
      setNewEmail(currentUser.email);
    }
  }, [currentUser]);

  // Handle password update
  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if ((accountInfo?.hasPassword && !passwordForm.currentPassword) || !passwordForm.newPassword || !passwordForm.confirmPassword) {
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

    if (!newEmail || newEmail === currentUser?.email) {
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
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      setDeleteError(err?.response?.data?.message || "Failed to delete account");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/auth/login");
  };

  const userInitial = currentUser?.profile?.name?.charAt(0)?.toUpperCase() ||
    currentUser?.email?.charAt(0)?.toUpperCase() ||
    "U";

  const formatDate = (date?: string) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <main
      className="min-h-screen"
      style={{
        background: "url(/auth-page.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Navbar isFixed={false} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            {/* Profile Avatar */}
            <div className="w-20 h-20 rounded-full bg-linear-to-br from-[#FD7EFF] to-[#A855F7] flex items-center justify-center text-white font-bold text-3xl shadow-lg">
              {userInitial}
            </div>
            <div>
              <h1 className="anybody text-3xl md:text-4xl font-bold text-white">
                {currentUser?.profile?.name || "User Profile"}
              </h1>
              <p className="text-white/70 text-sm mt-1">
                Manage your account settings and preferences
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate("/projects/accounts-and-billing")}
            className="px-6 py-2.5 rounded-full bg-linear-to-r from-[#7A49F2] to-[#5FA8FF] text-white font-medium flex items-center gap-2 hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(122,73,242,0.3)]"
          >
            <CreditCard size={18} />
            Accounts & Billing
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {/* Subscription Card */}
          <div
            className="rounded-2xl border border-[#2A2355] p-5 bg-[#000124]"
            style={{
              borderTop: "1px solid rgba(168, 85, 247, 0.2)",
              boxShadow: "rgba(168, 85, 247, 0.2) 0px 0px 40px 0px",
              background:
                "linear-gradient(135deg, rgba(0, 0, 0, 0) 0%, rgba(168, 85, 247, 0.15) 50%, rgba(0, 0, 0, 0) 100%) rgb(0, 1, 36)",
            }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-[#FD7EFF]/20 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-[#FFC2C8]" />
              </div>
              <div>
                <p className="text-white/60 text-xs uppercase tracking-wider">Plan</p>
                <p className="text-white font-semibold capitalize">
                  {subscription?.plan || "Free"}
                </p>
              </div>
            </div>
          </div>

          <div
            className="rounded-2xl border border-[#2A2355] p-5 bg-[#000124]"
            style={{
              borderTop: "1px solid rgba(168, 85, 247, 0.2)",
              boxShadow: "rgba(168, 85, 247, 0.2) 0px 0px 40px 0px",
              background:
                "linear-gradient(135deg, rgba(0, 0, 0, 0) 0%, rgba(168, 85, 247, 0.15) 50%, rgba(0, 0, 0, 0) 100%) rgb(0, 1, 36)",
            }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-pink-500/20 flex items-center justify-center">
                <User className="w-5 h-5 text-pink-400" />
              </div>
              <div>
                <p className="text-white/60 text-xs uppercase tracking-wider">Role</p>
                <p className="text-white font-medium text-sm">
                  {currentUser?.role || "User"}
                </p>
              </div>
            </div>
          </div>

          {/* Email Card */}
          <div
            className="rounded-2xl border border-[#2A2355] p-5 bg-[#000124]"
            style={{
              borderTop: "1px solid rgba(168, 85, 247, 0.2)",
              boxShadow: "rgba(168, 85, 247, 0.2) 0px 0px 40px 0px",
              background:
                "linear-gradient(135deg, rgba(0, 0, 0, 0) 0%, rgba(168, 85, 247, 0.15) 50%, rgba(0, 0, 0, 0) 100%) rgb(0, 1, 36)",
            }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Mail className="w-5 h-5 text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white/60 text-xs uppercase tracking-wider">Email</p>
                <p className="text-white font-medium text-sm truncate">
                  {currentUser?.email || "—"}
                </p>
              </div>
            </div>
          </div>

          {/* Member Since Card */}
          <div
            className="rounded-2xl border border-[#2A2355] p-5 bg-[#000124]"
            style={{
              borderTop: "1px solid rgba(168, 85, 247, 0.2)",
              boxShadow: "rgba(168, 85, 247, 0.2) 0px 0px 40px 0px",
              background:
                "linear-gradient(135deg, rgba(0, 0, 0, 0) 0%, rgba(168, 85, 247, 0.15) 50%, rgba(0, 0, 0, 0) 100%) rgb(0, 1, 36)",
            }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-white/60 text-xs uppercase tracking-wider">Member Since</p>
                <p className="text-white font-medium text-sm">
                  {formatDate((currentUser as unknown as Record<string, unknown>)?.createdAt as string)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Change Password */}
          <div
            className="rounded-2xl border border-[#2A2355] p-6 bg-[#000124]"
            style={{
              borderTop: "1px solid rgba(168, 85, 247, 0.2)",
              boxShadow: "rgba(168, 85, 247, 0.2) 0px 0px 40px 0px",
              background:
                "linear-gradient(135deg, rgba(0, 0, 0, 0) 0%, rgba(168, 85, 247, 0.15) 50%, rgba(0, 0, 0, 0) 100%) rgb(0, 1, 36)",
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <Key className="w-5 h-5 text-[#FFC2C8]" />
              <h2 className="urbanist text-xl font-bold text-white">Change Password</h2>
            </div>

            {accountInfo && !accountInfo.hasPassword && (
              <div className="mb-4 p-3 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-start gap-2">
                <AlertCircle size={16} className="text-blue-400 mt-0.5 shrink-0" />
                <p className="text-sm text-blue-300">
                  You signed up with {accountInfo.oauthProviders?.join(", ")}. Set a password to enable email/password login.
                </p>
              </div>
            )}

            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              {accountInfo?.hasPassword && (
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    placeholder="Enter current password"
                    className="w-full bg-[#3838381A] border border-[#ffffff66] rounded-xl px-4 py-3 text-white placeholder:text-[#A19DAF] focus:border-[#FD7EFF] focus:outline-none"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  placeholder="Enter new password (min 8 characters)"
                  className="w-full bg-[#3838381A] border border-[#ffffff66] rounded-xl px-4 py-3 text-white placeholder:text-[#A19DAF] focus:border-[#FD7EFF] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  placeholder="Confirm new password"
                  className="w-full bg-[#3838381A] border border-[#ffffff66] rounded-xl px-4 py-3 text-white placeholder:text-[#A19DAF] focus:border-[#FD7EFF] focus:outline-none"
                />
              </div>

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

              <PrimaryButton type="submit" disabled={updatePassword.isPending} moreClasses="w-full">
                {updatePassword.isPending ? "Updating..." : "Update Password"}
              </PrimaryButton>
            </form>
          </div>

          {/* Update Email */}
          <div
            className="rounded-2xl border border-[#2A2355] p-6 bg-[#000124]"
            style={{
              borderTop: "1px solid rgba(168, 85, 247, 0.2)",
              boxShadow: "rgba(168, 85, 247, 0.2) 0px 0px 40px 0px",
              background:
                "linear-gradient(135deg, rgba(0, 0, 0, 0) 0%, rgba(168, 85, 247, 0.15) 50%, rgba(0, 0, 0, 0) 100%) rgb(0, 1, 36)",
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <Mail className="w-5 h-5 text-[#FFC2C8]" />
              <h2 className="urbanist text-xl font-bold text-white">Update Email</h2>
            </div>

            <form onSubmit={handleEmailUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  New Email Address
                </label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="Enter new email address"
                  className="w-full bg-[#3838381A] border border-[#ffffff66] rounded-xl px-4 py-3 text-white placeholder:text-[#A19DAF] focus:border-[#FD7EFF] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  value={emailPassword}
                  onChange={(e) => setEmailPassword(e.target.value)}
                  placeholder="Enter password to confirm"
                  className="w-full bg-[#3838381A] border border-[#ffffff66] rounded-xl px-4 py-3 text-white placeholder:text-[#A19DAF] focus:border-[#FD7EFF] focus:outline-none"
                />
              </div>

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

              <PrimaryButton type="submit" disabled={updateEmail.isPending} moreClasses="w-full">
                {updateEmail.isPending ? "Updating..." : "Update Email"}
              </PrimaryButton>
            </form>
          </div>
        </div>

        {/* Danger Zone */}
        <div
          className="rounded-2xl border border-red-500/30 p-6 bg-[#000124] mt-6"
          style={{
            borderTop: "1px solid rgba(239, 68, 68, 0.3)",
            boxShadow: "rgba(239, 68, 68, 0.2) 0px 0px 40px 0px",
            background:
              "linear-gradient(135deg, rgba(0, 0, 0, 0) 0%, rgba(239, 68, 68, 0.1) 50%, rgba(0, 0, 0, 0) 100%) rgb(0, 1, 36)",
          }}
        >
          <div className="flex items-center gap-3 mb-4">
            <Trash2 className="w-5 h-5 text-red-400" />
            <h2 className="urbanist text-xl font-bold text-red-400">Danger Zone</h2>
          </div>

          <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 mb-4">
            <p className="text-sm text-red-300">
              ⚠️ This action cannot be undone. All your projects, scans, and account data will be permanently deleted.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowDeleteConfirm(!showDeleteConfirm)}
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-linear-to-r from-[#F04141] to-[#C11D1D] text-white font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          >
            <Trash2 size={16} />
            Delete Account
          </button>

          {showDeleteConfirm && (
            <div className="mt-4 p-4 rounded-lg bg-[#1A0A0A] border border-red-500/30 space-y-3">
              <p className="text-sm text-red-300 font-medium">
                ⚠️ Are you absolutely sure? This action cannot be undone.
              </p>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Enter your password to confirm
                </label>
                <input
                  type="password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  placeholder="Password"
                  className="w-full bg-[#3838381A] border border-[#ffffff66] rounded-xl px-4 py-3 text-white placeholder:text-[#A19DAF] focus:border-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Type DELETE to confirm
                </label>
                <input
                  type="text"
                  value={deleteConfirmation}
                  onChange={(e) => setDeleteConfirmation(e.target.value)}
                  placeholder="DELETE"
                  className="w-full bg-[#3838381A] border border-[#ffffff66] rounded-xl px-4 py-3 text-white placeholder:text-[#A19DAF] focus:border-red-500 focus:outline-none"
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
                  className="flex-1 px-4 py-3 rounded-full border border-white/20 text-white font-medium hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  disabled={deleteAccount.isPending || !deletePassword || deleteConfirmation.toLowerCase() !== "delete"}
                  className="flex-1 px-4 py-3 rounded-full bg-linear-to-r from-[#F04141] to-[#C11D1D] text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deleteAccount.isPending ? "Deleting..." : "Yes, Delete My Account"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Logout Button */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={handleLogout}
            className="px-6 py-3 rounded-full border border-white/20 text-white font-medium flex items-center gap-2 hover:bg-white/5 transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>
    </main>
  );
};

export default Profile;
