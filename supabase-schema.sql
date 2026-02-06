-- SorokinAi Database Schema for Supabase
-- Run this in your Supabase SQL Editor to set up the required tables

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- Chats table
create table if not exists public.chats (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null default 'New Chat',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Messages table
create table if not exists public.messages (
  id uuid default uuid_generate_v4() primary key,
  chat_id uuid references public.chats(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  role text not null check (role in ('user', 'assistant')),
  content text not null default '',
  image_url text,
  model text not null default 'flash',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Usage logs table
create table if not exists public.usage_logs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  model text not null,
  used_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Indexes for performance
create index if not exists idx_chats_user_id on public.chats(user_id);
create index if not exists idx_chats_updated_at on public.chats(updated_at desc);
create index if not exists idx_messages_chat_id on public.messages(chat_id);
create index if not exists idx_messages_created_at on public.messages(created_at);
create index if not exists idx_usage_logs_user_id_model on public.usage_logs(user_id, model);
create index if not exists idx_usage_logs_used_at on public.usage_logs(used_at);

-- Row Level Security (RLS)
alter table public.chats enable row level security;
alter table public.messages enable row level security;
alter table public.usage_logs enable row level security;

-- RLS Policies: Users can only access their own data

-- Chats
create policy "Users can view own chats"
  on public.chats for select
  using (auth.uid() = user_id);

create policy "Users can create own chats"
  on public.chats for insert
  with check (auth.uid() = user_id);

create policy "Users can update own chats"
  on public.chats for update
  using (auth.uid() = user_id);

create policy "Users can delete own chats"
  on public.chats for delete
  using (auth.uid() = user_id);

-- Messages
create policy "Users can view own messages"
  on public.messages for select
  using (auth.uid() = user_id);

create policy "Users can create own messages"
  on public.messages for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own messages"
  on public.messages for delete
  using (auth.uid() = user_id);

-- Usage logs
create policy "Users can view own usage"
  on public.usage_logs for select
  using (auth.uid() = user_id);

create policy "Users can log own usage"
  on public.usage_logs for insert
  with check (auth.uid() = user_id);
