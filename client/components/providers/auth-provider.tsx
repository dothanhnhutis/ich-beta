"use client";
import { mainFetch } from "@/lib/custom-fetch";
import { User } from "@/schema/user.schema";
import { changeEmail, getCurrentUser, signOut } from "@/services/users.service";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";

type AuthContext = {
  currentUser: User | null;
  signOut: () => Promise<void>;
  changeEmail: (email: string) => Promise<void>;
};

const authContext = React.createContext<AuthContext>({
  currentUser: null,
  signOut: async () => {},
  changeEmail: async (email: string) => {},
});

export const useAuth = () => React.useContext(authContext);

export const AuthProvider = ({
  initUser,
  children,
}: {
  initUser: User | null;
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
    <authContext.Provider
      value={{
        currentUser: initUser,
        signOut: handleSignOut,
        changeEmail: handleChangeEmail,
      }}
    >
      {children}
    </authContext.Provider>
  );
};
