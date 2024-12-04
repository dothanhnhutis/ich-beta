"use client";
import React from "react";
import { EditorState, Transaction } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import {
  DOMParser,
  DOMSerializer,
  MarkType,
  NodeType,
} from "prosemirror-model";
import { defaultKeymap } from "./keymap";
import { schemaDefault } from "./schema";
import NodeList from "./components/node";

const CustomEditorPage = () => {
  const editorRef = React.useRef<HTMLDivElement | null>(null);
  const editorViewRef = React.useRef<EditorView | null>(null);

  React.useEffect(() => {
    if (!editorRef.current) return;
    const contentElement = document.createElement("div");

    const state = EditorState.create({
      schema: schemaDefault,
      // doc: DOMParser.fromSchema(schemaDefault).parse(contentElement),
    });

    editorViewRef.current = new EditorView(editorRef.current, {
      state,
      plugins: [defaultKeymap],
      dispatchTransaction: (transaction) => {
        const newState = editorViewRef.current!.state.apply(transaction);
        editorViewRef.current!.updateState(newState);
      },
    });

    return () => {
      if (editorViewRef.current) {
        editorViewRef.current.destroy();
        editorViewRef.current = null;
      }
    };
  }, []);

  const handleGetHTML = (): string => {
    if (!editorViewRef.current) return "";
    const serializer = DOMSerializer.fromSchema(
      editorViewRef.current.state.schema
    );
    const fragment = serializer.serializeFragment(
      editorViewRef.current.state.doc.content
    );
    const temporaryDiv = document.createElement("div");
    temporaryDiv.appendChild(fragment);
    return temporaryDiv.innerHTML;
  };
  const handleGetText = (): string => {
    if (!editorViewRef.current) return "";
    return editorViewRef.current.state.doc.textContent;
  };
  const handleGetJSON = (): object => {
    if (!editorViewRef.current) return {};
    return editorViewRef.current.state.doc.toJSON();
  };

  return (
    <div className="p-4">
      <NodeList view={editorViewRef.current} />

      <div
        ref={editorRef}
        className="p-2 [&>*]:outline-none [&>*]:whitespace-pre-wrap rounded border bg-white"
      />
    </div>
  );
};

export default CustomEditorPage;
