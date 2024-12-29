"use client";
import React from "react";
import { User, UserSession } from "@/schema/user.schema";
import { changeEmail, signOut } from "@/services/users.service";

type AuthContext = {
  currentUser: User | null;
  currentSession: UserSession | null;
  signOut: () => Promise<void>;
  changeEmail: (email: string) => Promise<void>;
};

const AuthContext = React.createContext<AuthContext | null>(null);

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within a AuthProvider.");
  }
  return context;
};

export const AuthProvider = ({
  initUser,
  initSession,
  children,
}: {
  initUser: User | null;
  initSession: UserSession | null;
  children: React.ReactNode;
}) => {
  const handleSignOut = async () => {
    if (!initUser) return;
    await signOut();
  };

  const handleChangeEmail = async (email: string) => {
    await changeEmail(email);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser: initUser,
        signOut: handleSignOut,
        changeEmail: handleChangeEmail,
        currentSession: initSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
