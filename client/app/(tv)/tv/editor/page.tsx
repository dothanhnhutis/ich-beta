"use client";
import React from "react";
import { EditorContent, useEditor } from "./use-editor";
import { schemaDefault } from "./schema";

const EditorPage = () => {
  const editor = useEditor({
    schema: schemaDefault,
    onchange(editor) {
      console.log(editor.state.doc.textContent);
    },
  });
  return <EditorContent editor={editor}></EditorContent>;
};

export default EditorPage;
