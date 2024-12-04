"use client";
import { EditorState, Transaction } from "prosemirror-state";
import React from "react";
import { schemaDefault } from "./editor/schema";
import { EditorProvider } from "./editor/editor-provider";
import { defaultKeymap } from "./editor/keymap";
import { EditorView } from "prosemirror-view";
import { DOMSerializer } from "prosemirror-model";
import NodeList from "./editor/components/node-list";
import {
  AlignCenterIcon,
  AlignJustifyIcon,
  AlignLeftIcon,
  AlignRightIcon,
  BoldIcon,
  ItalicIcon,
  ListIcon,
  ListOrderedIcon,
  StrikethroughIcon,
  UnderlineIcon,
} from "lucide-react";

const TipTap2 = () => {
  const [mount, setMount] = React.useState<HTMLElement | null>(null);
  const [state, setState] = React.useState<EditorState>(
    EditorState.create({ schema: schemaDefault })
  );

  const getText = (view: EditorView) => {
    return view.state.doc.textContent;
  };
  const getJSON = (view: EditorView) => {
    return view.state.doc.toJSON();
  };
  const getHTML = (view: EditorView) => {
    const {
      state: { doc, schema },
    } = view;
    const serializer = DOMSerializer.fromSchema(schema);
    const fragment = serializer.serializeFragment(doc.content);
    const temporaryDiv = document.createElement("div");
    temporaryDiv.appendChild(fragment);
    return temporaryDiv.innerHTML;
  };

  return (
    <EditorProvider
      mount={mount}
      defaultState={state}
      dispatchTransaction={(transaction, view) => {
        console.log(getHTML(view));
      }}
      plugins={[defaultKeymap]}
    >
      <div className="flex gap-2">
        <NodeList />
        <button className="p-2 rounded-md border">
          <BoldIcon className="shrink-0 size-6" />
        </button>
        <button className="p-2 rounded-md border">
          <StrikethroughIcon className="shrink-0 size-6" />
        </button>
        <button className="p-2 rounded-md border">
          <UnderlineIcon className="shrink-0 size-6" />
        </button>
        <button className="p-2 rounded-md border">
          <ItalicIcon className="shrink-0 size-6" />
        </button>
        <button className="p-2 rounded-md border">
          <AlignLeftIcon className="shrink-0 size-6" />
        </button>
        <button className="p-2 rounded-md border">
          <AlignCenterIcon className="shrink-0 size-6" />
        </button>
        <button className="p-2 rounded-md border">
          <AlignRightIcon className="shrink-0 size-6" />
        </button>
        <button className="p-2 rounded-md border">
          <AlignJustifyIcon className="shrink-0 size-6" />
        </button>
        <button className="p-2 rounded-md border">
          <ListIcon className="shrink-0 size-6" />
        </button>
        <button className="p-2 rounded-md border">
          <ListOrderedIcon className="shrink-0 size-6" />
        </button>
      </div>
      <div
        ref={setMount}
        className="p-2 [&>*]:outline-none [&>*]:whitespace-pre-wrap rounded border bg-white"
      />
    </EditorProvider>
  );
};

export default TipTap2;
