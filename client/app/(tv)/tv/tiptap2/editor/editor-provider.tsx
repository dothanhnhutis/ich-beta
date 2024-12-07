"use client";
import { EditorState, Transaction, Plugin } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import React from "react";
import { ReactNodeView } from "./components/more-btn";

type EditorContext = {
  view: EditorView | null;
  state: EditorState;
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
  defaultState,
  dispatchTransaction,
  plugins,
}: {
  children?: React.ReactNode;
  mount: HTMLElement | null;
  defaultState: EditorState;
  dispatchTransaction?: (tr: Transaction, view: EditorView) => void;
  plugins?: Plugin[];
}) => {
  const [view, setView] = React.useState<EditorView | null>(null);
  const [state, setState] = React.useState<EditorState>(defaultState);

  React.useEffect(() => {
    if (!mount) return;

    const newView = new EditorView(mount, {
      state,
      dispatchTransaction: (transaction) => {
        const newState = newView.state.apply(transaction);
        newView.updateState(newState);
        setState(newState);
        if (!dispatchTransaction) return;
        dispatchTransaction(transaction, newView);
      },
      plugins,
      nodeViews: {
        product: (node, view, getPos, decoration, decorationSource) =>
          new ReactNodeView(node, view, getPos, decoration),
      },
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
    <EditorConext.Provider value={{ view, state }}>
      {children}
    </EditorConext.Provider>
  );
};
