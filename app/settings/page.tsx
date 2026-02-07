"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import { useTheme } from "@/components/ThemeProvider";
import { supabase } from "@/lib/supabase";
import { getAllRemainingUses } from "@/lib/usage";
import { ModelTier, MODEL_CONFIG } from "@/lib/ai";

export default function SettingsPage() {
  const { user, loading: authLoading, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  const [remainingUses, setRemainingUses] = useState<Record<ModelTier, number>>({
    flash: 50,
    pro: 10,
    "deep-search": 3,
  });
  const [clearingHistory, setClearingHistory] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      getAllRemainingUses(user.id).then(setRemainingUses);
    }
  }, [user]);

  const handleClearHistory = async () => {
    if (!user) return;
    setClearingHistory(true);

    // Delete all messages first, then chats
    const { data: chats } = await supabase
      .from("chats")
      .select("id")
      .eq("user_id", user.id);

    if (chats) {
      for (const chat of chats) {
        await supabase.from("messages").delete().eq("chat_id", chat.id);
      }
      await supabase.from("chats").delete().eq("user_id", user.id);
    }

    setClearingHistory(false);
    setShowClearConfirm(false);
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-900">
        <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/chat"
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
            </Link>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Settings
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Profile */}
        <section className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Profile
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Email</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {user.email}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Member since</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {new Date(user.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        </section>

        {/* Plans */}
        <section className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Plans
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Free Plan */}
            <div className="border-2 border-brand-500 rounded-xl p-5 relative">
              <span className="absolute -top-2.5 left-4 bg-brand-600 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                Current Plan
              </span>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
                Free
              </h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                $0<span className="text-sm font-normal text-gray-500">/month</span>
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <svg className="w-4 h-4 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  Flash: {remainingUses.flash}/{MODEL_CONFIG.flash.dailyLimit} remaining today
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <svg className="w-4 h-4 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  Pro: {remainingUses.pro}/{MODEL_CONFIG.pro.dailyLimit} remaining today
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <svg className="w-4 h-4 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  Deep Search: {remainingUses["deep-search"]}/{MODEL_CONFIG["deep-search"].dailyLimit} remaining today
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <svg className="w-4 h-4 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  Image uploads
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <svg className="w-4 h-4 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  Chat history
                </li>
              </ul>
            </div>

            {/* Pro Plan */}
            <div className="border border-gray-200 dark:border-slate-700 rounded-xl p-5 opacity-80">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Pro
              </h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                $20<span className="text-sm font-normal text-gray-500">/month</span>
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <svg className="w-4 h-4 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  Unlimited access to all models
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <svg className="w-4 h-4 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  Priority support
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <svg className="w-4 h-4 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  Early access to new features
                </li>
              </ul>
              <button
                disabled
                className="mt-4 w-full py-2 px-4 bg-gray-200 dark:bg-slate-600 text-gray-500 dark:text-gray-400 font-medium rounded-lg cursor-not-allowed"
              >
                Coming Soon!
              </button>
            </div>
          </div>
        </section>

        {/* Preferences */}
        <section className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Preferences
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Theme
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Toggle between light and dark mode
                </p>
              </div>
              <button
                onClick={toggleTheme}
                className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors bg-gray-200 dark:bg-brand-600"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    theme === "dark" ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Clear Chat History
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Permanently delete all your conversations
                </p>
              </div>
              {showClearConfirm ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleClearHistory}
                    disabled={clearingHistory}
                    className="text-sm bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {clearingHistory ? "Clearing..." : "Confirm"}
                  </button>
                  <button
                    onClick={() => setShowClearConfirm(false)}
                    className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 px-3 py-1.5"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowClearConfirm(true)}
                  className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium"
                >
                  Clear History
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Account */}
        <section className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Account
          </h2>
          <button
            onClick={handleSignOut}
            className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium"
          >
            Sign Out
          </button>
        </section>

        {/* Legal Links */}
        <div className="flex gap-6 text-sm text-gray-500 dark:text-gray-400 justify-center pt-4 pb-8">
          <Link href="/terms" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
            Terms of Service
          </Link>
          <Link href="/privacy" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
            Privacy Policy
          </Link>
          <Link href="/acceptable-use" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
            Acceptable Use
          </Link>
        </div>
      </main>
    </div>
  );
}
