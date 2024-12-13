"use client";
import React from "react";
import { User } from "@/schema/user.schema";
import { changeEmail, signOut } from "@/services/users.service";
import { useQueryClient } from "@tanstack/react-query";

type AuthContext = {
  currentUser: User | null;
  signOut: () => Promise<void>;
  changeEmail: (email: string) => Promise<void>;
};

const AuthContext = React.createContext<AuthContext>({
  currentUser: null,
  signOut: async () => {},
  changeEmail: async (email: string) => {},
});

export const useAuth = () => React.useContext(AuthContext);

export const AuthProvider = ({
  initUser,
  initPolicies,
  children,
}: {
  initUser: User | null;
  initPolicies: any | null;
  children: React.ReactNode;
}) => {
  const queryClient = useQueryClient();

  const handleSignOut = async () => {
    if (!initUser) return;
    await signOut();
    queryClient.clear();
  };

  const handleChangeEmail = async (email: string) => {
    await changeEmail(email);
    queryClient.invalidateQueries({ queryKey: ["me"] });
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser: initUser,
        signOut: handleSignOut,
        changeEmail: handleChangeEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
