"use client";

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { User, UserRole } from "@/types";
import { supabase } from "@/lib/supabase";

interface AuthContextType {
  user: User | null;
  users: User[];
  loading: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  deleteUser: (id: string) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  getAdminUsers: () => Promise<User[]>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: profile } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();
        if (profile) {
          setUser({
            id: profile.id,
            name: profile.name,
            email: profile.email,
            role: profile.role,
            favorites: profile.favorites || [],
            createdAt: profile.created_at,
          });
        }
      }
      setLoading(false);
    })();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const { data: profile } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();
        if (profile) {
          setUser({
            id: profile.id,
            name: profile.name,
            email: profile.email,
            role: profile.role,
            favorites: profile.favorites || [],
            createdAt: profile.created_at,
          });
        }
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<{ ok: boolean; error?: string }> => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { ok: false, error: error.message.includes("Invalid") ? "Email ou mot de passe incorrect" : error.message };

    const { data: profile } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", data.user.id)
      .single();
    if (profile) {
      setUser({
        id: profile.id,
        name: profile.name,
        email: profile.email,
        role: profile.role,
        favorites: profile.favorites || [],
        createdAt: profile.created_at,
      });
    }
    return { ok: true };
  }, []);

  const register = useCallback(async (name: string, email: string, password: string, role: UserRole): Promise<{ ok: boolean; error?: string }> => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return { ok: false, error: error.message.includes("already") ? "Cet email est déjà utilisé" : error.message };
    if (!data.user) return { ok: false, error: "Erreur lors de l'inscription" };

    await supabase.from("user_profiles").upsert({
      id: data.user.id,
      name,
      email,
      role,
      favorites: [],
      created_at: new Date().toISOString(),
    });

    setUser({ id: data.user.id, name, email, role, favorites: [], createdAt: new Date().toISOString() });
    return { ok: true };
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
  }, []);

  const toggleFavorite = useCallback(async (id: string) => {
    setUser((prev) => {
      if (!prev) return prev;
      const favs = prev.favorites.includes(id) ? prev.favorites.filter((f) => f !== id) : [...prev.favorites, id];
      const updated = { ...prev, favorites: favs };
      supabase.from("user_profiles").update({ favorites: favs }).eq("id", prev.id);
      return updated;
    });
  }, []);

  const isFavorite = useCallback((id: string) => {
    return user?.favorites.includes(id) ?? false;
  }, [user]);

  const deleteUser = useCallback(async (id: string) => {
    setAllUsers((prev) => prev.filter((u) => u.id !== id));
  }, []);

  const updateUser = useCallback(async (id: string, updates: Partial<User>) => {
    setAllUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...updates } : u)));
    await supabase.from("user_profiles").update(updates).eq("id", id);
  }, []);

  const getAdminUsers = useCallback(async () => {
    const { data } = await supabase.from("user_profiles").select("*");
    if (data) {
      setAllUsers(data.map((u) => ({ id: u.id, name: u.name, email: u.email, role: u.role, favorites: u.favorites || [], createdAt: u.created_at })));
      return data.map((u) => ({ id: u.id, name: u.name, email: u.email, role: u.role, favorites: u.favorites || [], createdAt: u.created_at }));
    }
    return [];
  }, []);

  return (
    <AuthContext.Provider value={{ user, users: allUsers, loading, login, register, logout, toggleFavorite, isFavorite, deleteUser, updateUser, getAdminUsers }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
