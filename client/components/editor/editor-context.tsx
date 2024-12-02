import React from "react";

export type EditorConext = {};

export const EditorConext = React.createContext<EditorConext | null>(null);

export const useEditor = () => {
  const context = React.useContext(EditorConext);
  if (!context)
    throw new Error("useEditor must be used within a EditorProvider.");
  return context;
};
