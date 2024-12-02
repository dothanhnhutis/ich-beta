import React from "react";
import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { EditorConext } from "./editor-context";
import { Editor } from "./editor";
import { defaultSchema } from "./schema";

type EditorProps = {
  children?: React.ReactNode;
};

const EditorProvider = ({ children }: EditorProps) => {
  const editorRef = React.useRef<HTMLDivElement | null>(null);
  const editorViewRef = React.useRef<Editor | null>(null);

  React.useEffect(() => {
    if (!editorRef.current) return;

    editorViewRef.current = new Editor({
      container: editorRef.current,
      schema: defaultSchema,
    });

    return () => {
      if (editorViewRef.current) {
        editorViewRef.current.editorView.destroy();
        editorViewRef.current = null;
      }
    };
  }, []);

  // const handleToggleHeading = (level: number) => {
  //   if (editorViewRef.current) {
  //     const state = editorViewRef.current.state;
  //     toggleHeading(level)(state, editorViewRef.current.dispatch);
  //   }
  // };

  return <EditorConext.Provider value={null}>{children}</EditorConext.Provider>;
};

export default EditorProvider;
