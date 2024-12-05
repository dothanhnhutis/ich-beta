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
import { MarkBtn } from "./editor/components/mark-btn";
import AligmentBtn from "./editor/components/aligment-btn";
import ListBtn from "./editor/components/list-btn";

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
        <MarkBtn mark="bold" Icon={BoldIcon} />
        <MarkBtn mark="underline" Icon={UnderlineIcon} />
        <MarkBtn mark="italic" Icon={ItalicIcon} />
        <MarkBtn mark="strike" Icon={StrikethroughIcon} />
        <AligmentBtn alignment="left" Icon={AlignLeftIcon} />
        <AligmentBtn alignment="center" Icon={AlignCenterIcon} />
        <AligmentBtn alignment="right" Icon={AlignRightIcon} />
        <AligmentBtn alignment="justify" Icon={AlignJustifyIcon} />
        <ListBtn listType="bullet_list" Icon={ListIcon} />
        {/* <button className="p-2 rounded-md border">
          <ListIcon className="shrink-0 size-6" />
        </button> */}

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
