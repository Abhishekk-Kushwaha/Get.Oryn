import React from "react";
import { format, parseISO } from "date-fns";
import { motion } from "motion/react";
import {
  ArrowLeft,
  BadgeCheck,
  ChevronRight,
  CreditCard,
  Crown,
  FileText,
  KeyRound,
  LogOut,
  Mail,
  Moon,
  Shield,
  Sun,
  UserRound,
  Zap,
} from "lucide-react";
import { Card } from "../components/ui/Card";
import type { ViewType } from "../hooks/useAppRouter";
import {
  resolveDisplayName,
  resolveUserEmail,
  resolveUserInitial,
  type AppSession,
} from "../lib/account";

type AccountViewProps = {
  setView: React.Dispatch<React.SetStateAction<ViewType>>;
  session: AppSession;
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
  isProUser?: boolean;
  onUpgradeClick?: () => void;
};

type InlineStatus = {
  tone: "neutral" | "success" | "error";
  message: string;
};

const neutralActionStyle = {
  border: "1px solid var(--surface-border)",
  background: "var(--hover-overlay)",
  color: "var(--text-secondary)",
} as const;

function StatusMessage({ status }: { status: InlineStatus | null }) {
  if (!status) return null;

  const style =
    status.tone === "success"
      ? {
          border: "1px solid rgba(16,185,129,0.18)",
          background: "rgba(16,185,129,0.09)",
          color: "rgb(16 185 129)",
        }
      : status.tone === "error"
        ? {
            border: "1px solid rgba(244,63,94,0.16)",
            background: "rgba(244,63,94,0.09)",
            color: "rgb(225 29 72)",
          }
        : {
            border: "1px solid var(--surface-border)",
            background: "var(--hover-overlay)",
            color: "var(--text-secondary)",
          };

  return (
    <div
      className="rounded-[12px] px-3 py-2 text-[12px] font-medium"
      style={style}
    >
      {status.message}
    </div>
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div
      className="rounded-[14px] px-4 py-3"
      style={{
        border: "1px solid var(--surface-border)",
        background: "var(--stat-cell-bg)",
      }}
    >
      <p
        className="text-[10px] font-bold uppercase tracking-[0.18em]"
        style={{ color: "var(--text-faint)" }}
      >
        {label}
      </p>
      <p
        className="mt-1 truncate text-[15px] font-semibold"
        style={{ color: "var(--text-primary)" }}
      >
        {value}
      </p>
    </div>
  );
}

export function AccountView({
  setView,
  session,
  theme,
  setTheme,
  isProUser = false,
  onUpgradeClick,
}: AccountViewProps) {
  const displayName = resolveDisplayName(session);
  const userEmail = resolveUserEmail(session);
  const userInitial = resolveUserInitial(session);
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [displayNameDraft, setDisplayNameDraft] = React.useState(displayName);
  const [displayNameStatus, setDisplayNameStatus] =
    React.useState<InlineStatus | null>(null);
  const [passwordStatus, setPasswordStatus] = React.useState<InlineStatus | null>(
    null,
  );
  const [resetStatus, setResetStatus] = React.useState<InlineStatus | null>(null);
  const [isUpdatingDisplayName, setIsUpdatingDisplayName] = React.useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = React.useState(false);
  const [isSendingReset, setIsSendingReset] = React.useState(false);
  const memberSince = React.useMemo(() => {
    const rawDate = session?.user?.created_at;
    if (!rawDate) return "Recently joined";

    const parsed = parseISO(rawDate);
    if (Number.isNaN(parsed.getTime())) return "Recently joined";
    return format(parsed, "MMMM yyyy");
  }, [session?.user?.created_at]);

  React.useEffect(() => {
    setDisplayNameDraft(displayName);
  }, [displayName]);

  const canManageProfile = false;
  const canManagePassword = canManageProfile;
  const canSendReset = false;

  const handleDisplayNameSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setDisplayNameStatus(null);

    if (!canManageProfile) {
      setDisplayNameStatus({
        tone: "error",
        message: "Profile updates are unavailable right now.",
      });
      return;
    }

    const nextName = displayNameDraft.trim();
    if (nextName.length < 2) {
      setDisplayNameStatus({
        tone: "error",
        message: "Use at least 2 characters for the display name.",
      });
      return;
    }

    try {
      setIsUpdatingDisplayName(true);
      // Removed Supabase Call
      await new Promise(r => setTimeout(r, 1000));
      const result = { error: { message: "Local storage accounts cannot be updated" } };

      if (result?.error?.message) {
        setDisplayNameStatus({
          tone: "error",
          message: result.error.message,
        });
        return;
      }

      setDisplayNameDraft(nextName);
      setDisplayNameStatus({
        tone: "success",
        message: "Display name updated.",
      });
    } catch (error) {
      setDisplayNameStatus({
        tone: "error",
        message:
          error instanceof Error
            ? error.message
            : "Could not update the display name.",
      });
    } finally {
      setIsUpdatingDisplayName(false);
    }
  };

  const handlePasswordSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPasswordStatus(null);

    if (!canManagePassword) {
      setPasswordStatus({
        tone: "error",
        message: "Password updates are unavailable right now.",
      });
      return;
    }

    if (newPassword.trim().length < 8) {
      setPasswordStatus({
        tone: "error",
        message: "Use at least 8 characters for the new password.",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordStatus({
        tone: "error",
        message: "The confirmation password does not match.",
      });
      return;
    }

    try {
      setIsUpdatingPassword(true);
      // Removed Supabase Call
      await new Promise(r => setTimeout(r, 1000));
      const result = { error: { message: "Local storage accounts cannot be updated" } };

      if (result?.error?.message) {
        setPasswordStatus({
          tone: "error",
          message: result.error.message,
        });
        return;
      }

      setNewPassword("");
      setConfirmPassword("");
      setPasswordStatus({
        tone: "success",
        message: "Password updated successfully.",
      });
    } catch (error) {
      setPasswordStatus({
        tone: "error",
        message:
          error instanceof Error
            ? error.message
            : "Password update failed. Try again.",
      });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleSendReset = async () => {
    setResetStatus(null);

    if (!userEmail || !canSendReset) {
      setResetStatus({
        tone: "error",
        message: "Reset instructions are unavailable for this account.",
      });
      return;
    }

    try {
      setIsSendingReset(true);
      // Removed Supabase Call
      await new Promise(r => setTimeout(r, 1000));
      const result = { error: { message: "Local storage accounts cannot be updated" } };

      if (result?.error?.message) {
        setResetStatus({
          tone: "error",
          message: result.error.message,
        });
        return;
      }

      setResetStatus({
        tone: "success",
        message: `Reset instructions sent to ${userEmail}.`,
      });
    } catch (error) {
      setResetStatus({
        tone: "error",
        message:
          error instanceof Error
            ? error.message
            : "Could not send reset instructions.",
      });
    } finally {
      setIsSendingReset(false);
    }
  };

  return (
    <motion.div
      key="account"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="mx-auto w-full max-w-6xl p-4 md:p-8"
    >
      <div className="mb-6 flex flex-col gap-3 md:mb-8 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setView("dashboard")}
            className="inline-flex h-11 items-center gap-2 rounded-[14px] px-4 text-sm font-semibold transition-colors"
            style={neutralActionStyle}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <span
            className="inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]"
            style={{
              border: "1px solid var(--surface-border)",
              background: "var(--hover-overlay)",
              color: "var(--text-muted)",
            }}
          >
            Workspace Settings
          </span>
        </div>
        <p
          className="text-sm"
          style={{ color: "var(--text-secondary)" }}
        >
          Manage your account, security, and preferences.
        </p>
      </div>

      <Card className="mb-6 overflow-hidden">
        <div className="grid gap-5 p-5 md:grid-cols-[auto_1fr] md:items-center md:p-6">
          <div
            className="flex h-[84px] w-[84px] items-center justify-center rounded-full text-[30px] font-black tracking-[-0.04em]"
            style={{
              border: "1px solid rgba(251,146,60,0.18)",
              background: "rgba(251,146,60,0.08)",
              color: "#fb923c",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.45)",
            }}
          >
            {userInitial}
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className="inline-flex rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-500"
                style={{
                  borderColor: "rgba(16,185,129,0.16)",
                  background: "rgba(16,185,129,0.08)",
                }}
              >
                Personal Workspace
              </span>
              <span
                className="inline-flex rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]"
                style={{
                  borderColor: "var(--surface-border)",
                  background: "var(--hover-overlay)",
                  color: "var(--text-muted)",
                }}
              >
                Member since {memberSince}
              </span>
            </div>
            <h1
              className="mt-3 truncate text-[30px] font-black tracking-[-0.04em] md:text-[36px]"
              style={{ color: "var(--text-primary)" }}
            >
              {displayName}
            </h1>
            <p
              className="mt-2 truncate text-[15px]"
              style={{ color: "var(--text-secondary)" }}
            >
              {userEmail || "No email connected to this session."}
            </p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="p-5 md:p-6" delay={0.04}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p
                className="text-[11px] font-bold uppercase tracking-[0.22em]"
                style={{ color: "var(--text-faint)" }}
              >
                Account
              </p>
              <h2
                className="mt-2 text-[22px] font-bold tracking-[-0.03em]"
                style={{ color: "var(--text-primary)" }}
              >
                Identity
              </h2>
            </div>
            <div
              className="flex h-11 w-11 items-center justify-center rounded-[14px]"
              style={{
                border: "1px solid var(--surface-border)",
                background: "var(--hover-overlay)",
                color: "var(--text-secondary)",
              }}
            >
              <UserRound className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-5 grid gap-3">
            <form
              onSubmit={handleDisplayNameSubmit}
              className="rounded-[14px] px-4 py-3"
              style={{
                border: "1px solid var(--surface-border)",
                background: "var(--stat-cell-bg)",
              }}
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-end">
                <div className="min-w-0 flex-1">
                  <p
                    className="text-[10px] font-bold uppercase tracking-[0.18em]"
                    style={{ color: "var(--text-faint)" }}
                  >
                    Display name
                  </p>
                  <input
                    type="text"
                    value={displayNameDraft}
                    onChange={(event) => setDisplayNameDraft(event.target.value)}
                    className="mt-2 h-11 w-full rounded-[12px] px-3 text-sm font-medium oryn-input"
                    placeholder="Your name"
                    maxLength={60}
                  />
                </div>
                <button
                  type="submit"
                  disabled={
                    isUpdatingDisplayName ||
                    !canManageProfile ||
                    displayNameDraft.trim() === displayName
                  }
                  className="inline-flex h-11 items-center justify-center rounded-[12px] px-4 text-sm font-semibold transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
                  style={neutralActionStyle}
                >
                  {isUpdatingDisplayName ? "Saving..." : "Save"}
                </button>
              </div>
              <div className="mt-3">
                <StatusMessage status={displayNameStatus} />
              </div>
            </form>
            <DetailRow label="Email" value={userEmail || "Unavailable"} />
            <DetailRow label="Member since" value={memberSince} />
          </div>
        </Card>

        <Card className="p-5 md:p-6" delay={0.08}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p
                className="text-[11px] font-bold uppercase tracking-[0.22em]"
                style={{ color: "var(--text-faint)" }}
              >
                Preferences
              </p>
              <h2
                className="mt-2 text-[22px] font-bold tracking-[-0.03em]"
                style={{ color: "var(--text-primary)" }}
              >
                Theme
              </h2>
            </div>
            <div
              className="flex h-11 w-11 items-center justify-center rounded-[14px]"
              style={{
                border: "1px solid var(--surface-border)",
                background: "var(--hover-overlay)",
                color: "var(--text-secondary)",
              }}
            >
              {theme === "dark" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </div>
          </div>

          <p
            className="mt-3 text-sm leading-6"
            style={{ color: "var(--text-secondary)" }}
          >
            Pick how the workspace should look every time you sign in.
          </p>

          <div
            className="mt-5 flex rounded-[16px] p-1"
            style={{
              border: "1px solid var(--surface-border)",
              background: "var(--stat-cell-bg)",
            }}
          >
            {(["light", "dark"] as const).map((option) => {
              const selected = theme === option;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => setTheme(option)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-[12px] px-3 py-3 text-sm font-semibold transition-colors"
                  style={
                    selected
                      ? {
                          background: "var(--app-bg)",
                          color: "var(--text-primary)",
                          boxShadow: "var(--surface-shadow)",
                        }
                      : { color: "var(--text-muted)" }
                  }
                >
                  {option === "light" ? (
                    <Sun className="h-4 w-4" />
                  ) : (
                    <Moon className="h-4 w-4" />
                  )}
                  {option === "light" ? "Light" : "Dark"}
                </button>
              );
            })}
          </div>
        </Card>

        <Card className="p-5 md:p-6 lg:col-span-2" delay={0.12}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p
                className="text-[11px] font-bold uppercase tracking-[0.22em]"
                style={{ color: "var(--text-faint)" }}
              >
                Security
              </p>
              <h2
                className="mt-2 text-[22px] font-bold tracking-[-0.03em]"
                style={{ color: "var(--text-primary)" }}
              >
                Password and access
              </h2>
            </div>
            <div
              className="flex h-11 w-11 items-center justify-center rounded-[14px]"
              style={{
                border: "1px solid var(--surface-border)",
                background: "var(--hover-overlay)",
                color: "var(--text-secondary)",
              }}
            >
              <Shield className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
            <form
              onSubmit={handlePasswordSubmit}
              className="rounded-[18px] p-4 md:p-5"
              style={{
                border: "1px solid var(--surface-border)",
                background: "var(--surface-alt)",
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-[12px]"
                  style={{
                    border: "1px solid var(--surface-border)",
                    background: "var(--hover-overlay)",
                    color: "var(--text-secondary)",
                  }}
                >
                  <KeyRound className="h-4 w-4" />
                </div>
                <div>
                  <h3
                    className="text-[16px] font-semibold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Change password
                  </h3>
                  <p
                    className="text-[12px]"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Update your password without leaving the workspace.
                  </p>
                </div>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <input
                  type="password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  placeholder="New password"
                  className="h-11 rounded-[12px] px-3 text-sm font-medium oryn-input"
                  autoComplete="new-password"
                />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Confirm password"
                  className="h-11 rounded-[12px] px-3 text-sm font-medium oryn-input"
                  autoComplete="new-password"
                />
              </div>

              <div className="mt-3">
                <StatusMessage status={passwordStatus} />
              </div>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p
                  className="text-[12px]"
                  style={{ color: "var(--text-faint)" }}
                >
                  Minimum 8 characters. Use something unique to this account.
                </p>
                <button
                  type="submit"
                  disabled={isUpdatingPassword || !canManagePassword}
                  className="inline-flex h-11 items-center justify-center rounded-[12px] bg-orange-500 px-4 text-sm font-semibold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isUpdatingPassword ? "Updating..." : "Change password"}
                </button>
              </div>
            </form>

            <div
              className="rounded-[18px] p-4 md:p-5"
              style={{
                border: "1px solid var(--surface-border)",
                background: "var(--surface-alt)",
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-[12px]"
                  style={{
                    border: "1px solid var(--surface-border)",
                    background: "var(--hover-overlay)",
                    color: "var(--text-secondary)",
                  }}
                >
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <h3
                    className="text-[16px] font-semibold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Send reset email
                  </h3>
                  <p
                    className="text-[12px]"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Deliver recovery instructions to your signed-in email.
                  </p>
                </div>
              </div>

              <div
                className="mt-4 rounded-[14px] px-4 py-3"
                style={{
                  border: "1px solid var(--surface-border)",
                  background: "var(--stat-cell-bg)",
                }}
              >
                <p
                  className="text-[10px] font-bold uppercase tracking-[0.18em]"
                  style={{ color: "var(--text-faint)" }}
                >
                  Destination
                </p>
                <p
                  className="mt-1 truncate text-[14px] font-semibold"
                  style={{ color: "var(--text-primary)" }}
                >
                  {userEmail || "No email available"}
                </p>
              </div>

              <div className="mt-3">
                <StatusMessage status={resetStatus} />
              </div>

              <button
                type="button"
                onClick={() => void handleSendReset()}
                disabled={isSendingReset || !canSendReset}
                className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-[12px] px-4 text-sm font-semibold transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
                style={neutralActionStyle}
              >
                {isSendingReset ? "Sending..." : "Send reset email"}
              </button>
            </div>
          </div>
        </Card>

        <Card className="p-5 md:p-6" delay={0.16}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p
                className="text-[11px] font-bold uppercase tracking-[0.22em]"
                style={{ color: "var(--text-faint)" }}
              >
                Billing & Subscription
              </p>
              <h2
                className="mt-2 text-[22px] font-bold tracking-[-0.03em]"
                style={{ color: "var(--text-primary)" }}
              >
                Billing
              </h2>
            </div>
            <div
              className="flex h-11 w-11 items-center justify-center rounded-[14px]"
              style={{
                border: "1px solid var(--surface-border)",
                background: "var(--hover-overlay)",
                color: "var(--text-secondary)",
              }}
            >
              <CreditCard className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-5 space-y-3">
            <div
              className="rounded-[16px] px-4 py-4"
              style={{
                border: isProUser
                  ? "1px solid rgba(52,211,153,0.2)"
                  : "1px solid rgba(249,115,22,0.16)",
                background: isProUser
                  ? "rgba(52,211,153,0.04)"
                  : "linear-gradient(135deg, rgba(249,115,22,0.05), rgba(245,158,11,0.02), transparent)",
              }}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px]"
                    style={{
                      background: isProUser
                        ? "rgba(52,211,153,0.1)"
                        : "linear-gradient(135deg, #f97316, #f59e0b)",
                      border: isProUser
                        ? "1px solid rgba(52,211,153,0.18)"
                        : "none",
                    }}
                  >
                    {isProUser ? (
                      <BadgeCheck className="h-5 w-5 text-emerald-400" />
                    ) : (
                      <Crown className="h-5 w-5 text-white" />
                    )}
                  </div>
                  <div>
                    <p
                      className="text-[14px] font-semibold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {isProUser ? "Oryn Pro" : "Free Plan"}
                    </p>
                    <p
                      className="mt-0.5 text-[12px]"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {isProUser
                        ? "You have full access to all premium features."
                        : "Upgrade to unlock AI insights, unlimited goals, and more."}
                    </p>
                  </div>
                </div>
                {isProUser ? (
                  <span
                    className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em]"
                    style={{
                      border: "1px solid rgba(52,211,153,0.18)",
                      background: "rgba(52,211,153,0.08)",
                      color: "rgb(52,211,153)",
                    }}
                  >
                    <Zap className="h-3 w-3" />
                    Active
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={onUpgradeClick}
                    className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-400 px-4 py-2 text-[11px] font-black text-white shadow-md shadow-orange-500/25 transition-transform hover:scale-[1.04] active:scale-[0.97]"
                  >
                    <Crown className="h-3.5 w-3.5" />
                    Upgrade
                  </button>
                )}
              </div>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              <div
                className="rounded-[14px] px-4 py-3"
                style={{
                  border: "1px solid var(--surface-border)",
                  background: "var(--stat-cell-bg)",
                }}
              >
                <p
                  className="text-[10px] font-bold uppercase tracking-[0.18em]"
                  style={{ color: "var(--text-faint)" }}
                >
                  Current Plan
                </p>
                <p
                  className="mt-1 text-[13px] font-semibold"
                  style={{ color: "var(--text-primary)" }}
                >
                  {isProUser ? "Pro — Active" : "Free"}
                </p>
              </div>
              <div
                className="rounded-[14px] px-4 py-3"
                style={{
                  border: "1px solid var(--surface-border)",
                  background: "var(--stat-cell-bg)",
                }}
              >
                <p
                  className="text-[10px] font-bold uppercase tracking-[0.18em]"
                  style={{ color: "var(--text-faint)" }}
                >
                  Payment Method
                </p>
                <p
                  className="mt-1 text-[13px] font-semibold"
                  style={{ color: "var(--text-primary)" }}
                >
                  {isProUser ? "Razorpay" : "None"}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-5 md:p-6" delay={0.2}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p
                className="text-[11px] font-bold uppercase tracking-[0.22em]"
                style={{ color: "var(--text-faint)" }}
              >
                Legal
              </p>
              <h2
                className="mt-2 text-[22px] font-bold tracking-[-0.03em]"
                style={{ color: "var(--text-primary)" }}
              >
                Terms and privacy
              </h2>
            </div>
            <div
              className="flex h-11 w-11 items-center justify-center rounded-[14px]"
              style={{
                border: "1px solid var(--surface-border)",
                background: "var(--hover-overlay)",
                color: "var(--text-secondary)",
              }}
            >
              <FileText className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-5 space-y-2">
            {[
              {
                label: "Terms of Use",
                detail: "Policy surface reserved for the public legal copy.",
              },
              {
                label: "Privacy Policy",
                detail: "Privacy details can slot in here when available.",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between gap-3 rounded-[14px] px-4 py-3"
                style={{
                  border: "1px solid var(--surface-border)",
                  background: "var(--surface-alt)",
                }}
              >
                <div className="min-w-0">
                  <p
                    className="text-[14px] font-semibold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {item.label}
                  </p>
                  <p
                    className="mt-1 text-[12px]"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {item.detail}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className="inline-flex rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em]"
                    style={{
                      border: "1px solid var(--surface-border)",
                      background: "var(--hover-overlay)",
                      color: "var(--text-muted)",
                    }}
                  >
                    Coming soon
                  </span>
                  <ChevronRight
                    className="h-4 w-4 shrink-0"
                    style={{ color: "var(--text-faint)" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5 md:p-6 lg:col-span-2" delay={0.24}>
          <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p
                className="text-[11px] font-bold uppercase tracking-[0.22em]"
                style={{ color: "var(--text-faint)" }}
              >
                Session
              </p>
              <h2
                className="mt-2 text-[22px] font-bold tracking-[-0.03em]"
                style={{ color: "var(--text-primary)" }}
              >
                Sign out
              </h2>
              <p
                className="mt-2 max-w-2xl text-sm leading-6"
                style={{ color: "var(--text-secondary)" }}
              >
                End this session when you are done. Your saved theme and account
                preferences stay intact for the next sign-in.
              </p>
            </div>

            <div className="grid gap-2 sm:grid-cols-2 lg:min-w-[360px]">
              <div
                className="rounded-[14px] px-4 py-3"
                style={{
                  border: "1px solid var(--surface-border)",
                  background: "var(--stat-cell-bg)",
                }}
              >
                <p
                  className="text-[10px] font-bold uppercase tracking-[0.18em]"
                  style={{ color: "var(--text-faint)" }}
                >
                  Auth status
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <BadgeCheck className="h-4 w-4 text-emerald-500" />
                  <span
                    className="text-[13px] font-semibold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Local Storage
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </motion.div>
  );
}
