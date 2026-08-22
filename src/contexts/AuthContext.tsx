"use client";

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { User, UserRole } from "@/types";

interface StoredUser extends User {
  passwordHash: string;
}

const ADMIN_USER: StoredUser = {
  id: "admin-1",
  name: "Admin Meknès",
  email: "admin@espace-meknes.ma",
  passwordHash: "admin123",
  role: "admin",
  favorites: [],
  createdAt: "2024-01-01",
};

const USERS_KEY = "em_users";
const SESSION_KEY = "em_session";

function getUsers(): StoredUser[] {
  if (typeof window === "undefined") return [ADMIN_USER];
  const raw = localStorage.getItem(USERS_KEY);
  if (!raw) {
    localStorage.setItem(USERS_KEY, JSON.stringify([ADMIN_USER]));
    return [ADMIN_USER];
  }
  const users = JSON.parse(raw) as StoredUser[];
  const hasAdmin = users.some((u) => u.role === "admin");
  if (!hasAdmin) {
    users.push(ADMIN_USER);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }
  return users;
}

function saveUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function getSession(): User | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(SESSION_KEY);
  return raw ? JSON.parse(raw) : null;
}

function setSession(user: User | null) {
  if (user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
}

interface AuthContextType {
  user: User | null;
  users: User[];
  loading: boolean;
  login: (email: string, password: string) => { ok: boolean; error?: string };
  register: (name: string, email: string, password: string, role: UserRole) => { ok: boolean; error?: string };
  logout: () => void;
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  deleteUser: (id: string) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  getAdminUsers: () => StoredUser[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<StoredUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = getSession();
    const users = getUsers();
    setUser(session);
    setAllUsers(users);
    setLoading(false);
  }, []);

  const login = useCallback((email: string, password: string): { ok: boolean; error?: string } => {
    const users = getUsers();
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.passwordHash === password);
    if (!found) return { ok: false, error: "Email ou mot de passe incorrect" };
    const { passwordHash, ...userData } = found;
    setUser(userData);
    setSession(userData);
    return { ok: true };
  }, []);

  const register = useCallback((name: string, email: string, password: string, role: UserRole): { ok: boolean; error?: string } => {
    const users = getUsers();
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { ok: false, error: "Cet email est déjà utilisé" };
    }
    const newUser: StoredUser = {
      id: `user-${Date.now()}`,
      name,
      email,
      passwordHash: password,
      role,
      favorites: [],
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    saveUsers(users);
    setAllUsers([...users]);
    const { passwordHash, ...userData } = newUser;
    setUser(userData);
    setSession(userData);
    return { ok: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setSession(null);
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setUser((prev) => {
      if (!prev) return prev;
      const favs = prev.favorites.includes(id) ? prev.favorites.filter((f) => f !== id) : [...prev.favorites, id];
      const updated = { ...prev, favorites: favs };
      setSession(updated);
      const users = getUsers();
      const idx = users.findIndex((u) => u.id === prev.id);
      if (idx >= 0) {
        users[idx] = { ...users[idx], favorites: favs };
        saveUsers(users);
        setAllUsers([...users]);
      }
      return updated;
    });
  }, []);

  const isFavorite = useCallback((id: string) => {
    return user?.favorites.includes(id) ?? false;
  }, [user]);

  const deleteUser = useCallback((id: string) => {
    const users = getUsers().filter((u) => u.id !== id);
    saveUsers(users);
    setAllUsers([...users]);
  }, []);

  const updateUser = useCallback((id: string, updates: Partial<User>) => {
    const users = getUsers();
    const idx = users.findIndex((u) => u.id === id);
    if (idx >= 0) {
      users[idx] = { ...users[idx], ...updates };
      saveUsers(users);
      setAllUsers([...users]);
    }
  }, []);

  const getAdminUsers = useCallback(() => {
    return getUsers();
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
