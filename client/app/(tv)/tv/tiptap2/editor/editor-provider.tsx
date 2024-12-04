"use client";
import { EditorState, Transaction, Plugin } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import React from "react";

type EditorContext = {
  view: EditorView | null;
};
const EditorConext = React.createContext<EditorContext | null>(null);

export const useEditor = () => {
  const context = React.useContext(EditorConext);
  if (!context) {
    throw new Error("useEditor must be used within a EditorProvider.");
  }
  return context;
};

export const EditorProvider = ({
  children,
  mount,
  state,
  dispatchTransaction,
  plugins,
}: {
  children?: React.ReactNode;
  mount: HTMLElement | null;
  state: EditorState;
  dispatchTransaction?: (tr: Transaction, view: EditorView) => void;
  plugins?: Plugin[];
}) => {
  const [view, setView] = React.useState<EditorView | null>(null);

  React.useEffect(() => {
    if (!mount) return;

    const newView = new EditorView(mount, {
      state,
      dispatchTransaction: (transaction) => {
        const newState = newView.state.apply(transaction);
        newView.updateState(newState);

        if (!dispatchTransaction) return;
        dispatchTransaction(transaction, newView);
      },
      plugins,
    });
    setView(newView);

    return () => {
      if (view) {
        view.destroy();
        setView(null);
      }
    };
  }, [mount]);

  return (
    <EditorConext.Provider value={{ view }}>{children}</EditorConext.Provider>
  );
};
