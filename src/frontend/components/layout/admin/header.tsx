"use client";

import { useSession, signOut } from "next-auth/react";
import { LayoutDashboard, LogOut, Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";

export function AdminHeader() {
  const { data: session } = useSession();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const isDark = localStorage.getItem("darkMode") === "true";
    setDarkMode(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", newDarkMode.toString());
    document.documentElement.classList.toggle("dark", newDarkMode);
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/admin" });
  };

  return (
    <header className="bg-card border-b border-border">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <LayoutDashboard className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Panel Admin</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-muted hover:bg-accent transition-colors"
            >
              {darkMode ? (
                <Sun className="h-5 w-5 text-muted-foreground" />
              ) : (
                <Moon className="h-5 w-5 text-muted-foreground" />
              )}
            </button>
            <span className="text-muted-foreground">
              Hola, {session?.user?.name || session?.user?.email}
            </span>
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span>Salir</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
