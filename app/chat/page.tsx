"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import { useTheme } from "@/components/ThemeProvider";
import ChatSidebar from "@/components/ChatSidebar";
import ChatInput from "@/components/ChatInput";
import ChatMessage from "@/components/ChatMessage";
import ModelSelector from "@/components/ModelSelector";
import { supabase } from "@/lib/supabase";
import { ModelTier, generateResponse } from "@/lib/ai";
import { getAllRemainingUses, logUsage } from "@/lib/usage";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  image_url: string | null;
  model: string;
}

interface Chat {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export default function ChatPage() {
  const { user, loading: authLoading, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedModel, setSelectedModel] = useState<ModelTier>("flash");
  const [remainingUses, setRemainingUses] = useState<Record<ModelTier, number>>({
    flash: 50,
    pro: 10,
    "deep-search": 3,
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login");
    }
  }, [user, authLoading, router]);

  // Load chats
  const loadChats = useCallback(async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("chats")
      .select("*")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false });

    if (!error && data) {
      setChats(data);
    }
  }, [user]);

  // Load messages for active chat
  const loadMessages = useCallback(async (chatId: string) => {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("chat_id", chatId)
      .order("created_at", { ascending: true });

    if (!error && data) {
      setMessages(data);
    }
  }, []);

  // Load usage
  const loadUsage = useCallback(async () => {
    if (!user) return;
    const uses = await getAllRemainingUses(user.id);
    setRemainingUses(uses);
  }, [user]);

  useEffect(() => {
    loadChats();
    loadUsage();
  }, [loadChats, loadUsage]);

  useEffect(() => {
    if (activeChatId) {
      loadMessages(activeChatId);
    } else {
      setMessages([]);
    }
  }, [activeChatId, loadMessages]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Close user menu on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNewChat = () => {
    setActiveChatId(null);
    setMessages([]);
    setError(null);
  };

  const handleSelectChat = (chatId: string) => {
    setActiveChatId(chatId);
    setError(null);
  };

  const handleDeleteChat = async (chatId: string) => {
    if (!user) return;

    await supabase.from("messages").delete().eq("chat_id", chatId);
    await supabase.from("chats").delete().eq("id", chatId);

    if (activeChatId === chatId) {
      setActiveChatId(null);
      setMessages([]);
    }
    loadChats();
  };

  const handleSend = async (
    content: string,
    imageData: { data: string; mimeType: string } | null
  ) => {
    if (!user) return;
    if (!content.trim() && !imageData) return;

    setError(null);

    // Check usage limit
    if (remainingUses[selectedModel] <= 0) {
      setError(
        `You've reached your daily limit for ${selectedModel}. Try another model or come back tomorrow.`
      );
      return;
    }

    // Log usage
    const usageOk = await logUsage(user.id, selectedModel);
    if (!usageOk) {
      setError(
        `You've reached your daily limit for ${selectedModel}. Try another model or come back tomorrow.`
      );
      return;
    }

    setIsGenerating(true);

    let chatId = activeChatId;

    // Create chat if new
    if (!chatId) {
      const title = content.length > 50 ? content.slice(0, 50) + "..." : content || "Image prompt";
      const { data: newChat, error: chatError } = await supabase
        .from("chats")
        .insert({ user_id: user.id, title })
        .select()
        .single();

      if (chatError || !newChat) {
        setError("Failed to create chat. Please try again.");
        setIsGenerating(false);
        return;
      }
      chatId = newChat.id;
      setActiveChatId(chatId);
    }

    // Create image URL for display (if image provided)
    const imageUrl = imageData ? `data:${imageData.mimeType};base64,${imageData.data}` : null;

    // Save user message
    const { data: userMsg } = await supabase
      .from("messages")
      .insert({
        chat_id: chatId,
        user_id: user.id,
        role: "user" as const,
        content,
        image_url: imageUrl,
        model: selectedModel,
      })
      .select()
      .single();

    if (userMsg) {
      setMessages((prev) => [...prev, userMsg]);
    }

    // Generate AI response
    try {
      const chatHistory = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const aiResponse = await generateResponse(
        selectedModel,
        content,
        imageData,
        chatHistory
      );

      // Save AI message
      const { data: aiMsg } = await supabase
        .from("messages")
        .insert({
          chat_id: chatId,
          user_id: user.id,
          role: "assistant" as const,
          content: aiResponse,
          model: selectedModel,
        })
        .select()
        .single();

      if (aiMsg) {
        setMessages((prev) => [...prev, aiMsg]);
      }

      // Update chat timestamp
      await supabase
        .from("chats")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", chatId);
    } catch (err: any) {
      setError(
        err?.message || "Failed to get response from AI. Please try again."
      );
    }

    setIsGenerating(false);
    loadChats();
    loadUsage();
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  if (authLoading) {
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

  if (!user) return null;

  return (
    <div className="h-screen flex bg-white dark:bg-slate-900">
      <ChatSidebar
        chats={chats}
        activeChatId={activeChatId}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="border-b border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              </button>
              <ModelSelector
                selectedModel={selectedModel}
                onSelectModel={setSelectedModel}
                remainingUses={remainingUses}
              />
            </div>

            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="w-8 h-8 bg-brand-600 rounded-full flex items-center justify-center text-white font-medium text-sm hover:bg-brand-700 transition-colors"
              >
                {user.email?.[0]?.toUpperCase() || "U"}
              </button>

              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-56 card py-1 z-50 shadow-lg">
                  <div className="px-4 py-2 border-b border-gray-200 dark:border-slate-700">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {user.email}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Free Plan</p>
                  </div>
                  <Link
                    href="/settings"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                    onClick={() => setShowUserMenu(false)}
                  >
                    Settings
                  </Link>
                  <button
                    onClick={() => toggleTheme()}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    {theme === "dark" ? "Light Mode" : "Dark Mode"}
                  </button>
                  <hr className="border-gray-200 dark:border-slate-700" />
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center max-w-md px-4">
                <div className="w-16 h-16 bg-brand-100 dark:bg-brand-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-xl">S</span>
                  </div>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Welcome to SorokinAi
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  Ask me anything! I&apos;m ready to help with questions, analysis, coding, and more.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
                  {[
                    "Explain quantum computing simply",
                    "Write a Python sorting algorithm",
                    "Help me plan a trip to Japan",
                    "Analyze this image for me",
                  ].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() =>
                        handleSend(suggestion, null)
                      }
                      className="p-3 text-sm text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors text-left"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto px-4 py-6">
              {messages.map((msg) => (
                <ChatMessage
                  key={msg.id}
                  role={msg.role}
                  content={msg.content}
                  imageUrl={msg.image_url}
                  model={msg.role === "assistant" ? msg.model : undefined}
                />
              ))}
              {isGenerating && (
                <div className="flex justify-start mb-4">
                  <div className="bg-gray-100 dark:bg-slate-700 px-4 py-3 rounded-2xl rounded-bl-md">
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                      </div>
                      <span className="text-sm">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Error banner */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 border-t border-red-200 dark:border-red-800 px-4 py-2">
            <div className="max-w-3xl mx-auto flex items-center justify-between">
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
              <button
                onClick={() => setError(null)}
                className="text-red-500 hover:text-red-700 dark:hover:text-red-300"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Input */}
        <div className="max-w-3xl mx-auto w-full">
          <ChatInput
            onSend={handleSend}
            disabled={isGenerating}
            placeholder={
              isGenerating ? "Waiting for response..." : "Ask SorokinAi anything..."
            }
          />
        </div>
      </div>
    </div>
  );
}
