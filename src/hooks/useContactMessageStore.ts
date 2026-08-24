"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  category: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
}

function toCamel(obj: Record<string, unknown>): ContactMessage {
  const r: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    r[k.replace(/_([a-z])/g, (_: string, c: string) => c.toUpperCase())] = v;
  }
  return r as unknown as ContactMessage;
}

function toSnake(obj: Record<string, unknown>): Record<string, unknown> {
  const r: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    r[k.replace(/[A-Z]/g, (c) => "_" + c.toLowerCase())] = v;
  }
  return r;
}

export function useContactMessageStore() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false });
      if (data) setMessages(data.map(toCamel));
      setLoaded(true);
    })();
  }, []);

  const addMessage = useCallback(async (msg: Omit<ContactMessage, "id" | "status" | "createdAt">) => {
    const newMsg: ContactMessage = {
      ...msg,
      id: `cm-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      status: "unread",
      createdAt: new Date().toISOString(),
    };
    const snake = toSnake(newMsg as unknown as Record<string, unknown>);
    const { error } = await supabase.from("contact_messages").upsert(snake);
    if (error) {
      console.error("Failed to save contact message:", error.message);
      throw new Error(error.message);
    }
    setMessages((prev) => [newMsg, ...prev]);
    return newMsg;
  }, []);

  const markRead = useCallback(async (id: string) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, status: "read" } : m)));
    await supabase.from("contact_messages").update({ status: "read" }).eq("id", id);
  }, []);

  const deleteMessage = useCallback(async (id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
    await supabase.from("contact_messages").delete().eq("id", id);
  }, []);

  return { messages, addMessage, markRead, deleteMessage, loaded };
}
