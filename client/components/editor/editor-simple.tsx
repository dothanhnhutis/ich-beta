"use client";
import React from "react";
import { EditorState, Transaction } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { DOMParser, MarkType, NodeType } from "prosemirror-model";
import { defaultKeymap } from "./keymap";
import { schemaDefault } from "./schema";
import {
  AlignCenterIcon,
  AlignJustifyIcon,
  AlignLeft,
  AlignLeftIcon,
  AlignRightIcon,
  BoldIcon,
  Check,
  ChevronsUpDown,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  Heading4Icon,
  ItalicIcon,
  ListIcon,
  ListOrderedIcon,
  LucideIcon,
  PilcrowIcon,
  StrikethroughIcon,
  UnderlineIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

import NodeList from "./components/node";

const EditorSimple = () => {
  const editorRef = React.useRef<HTMLDivElement | null>(null);
  const editorViewRef = React.useRef<EditorView | null>(null);
  const [state, setState] = React.useState<EditorState | null>(null);

  React.useEffect(() => {
    if (!editorRef.current) return;
    const contentElement = document.createElement("div");

    const state = EditorState.create({
      doc: DOMParser.fromSchema(schemaDefault).parse(contentElement),
    });

    editorViewRef.current = new EditorView(editorRef.current, {
      state,
      plugins: [defaultKeymap],
      dispatchTransaction: (transaction) => {
        const newState = editorViewRef.current!.state.apply(transaction);
        editorViewRef.current!.updateState(newState);

        setState(newState);

        // if (transaction.selectionSet) {
        //   const cursorPosition = getCursorPosition(newState);
        //   console.log("Cursor moved:", cursorPosition);
        // }
      },
    });
    setState(state);

    const getCursorPosition = (state: EditorState) => {
      const { from, to } = state.selection;
      return { from, to, isCollapsed: from === to };
    };

    return () => {
      if (editorViewRef.current) {
        editorViewRef.current.destroy();
        editorViewRef.current = null;
      }
    };
  }, []);

  const handleHeading = (level: number) => {
    if (!editorViewRef.current) return;
    const { state, dispatch } = editorViewRef.current;
    state;
    const { $from, $to } = state.selection;
    const range = $from.blockRange($to);
    if (!range || !dispatch) return;
    const { heading } = state.schema.nodes;
    if (!heading) return;
    const tr = state.tr;
    tr.setBlockType(range.start, range.end, heading, { level });
    dispatch(tr);
  };

  const handleParagraph = () => {
    if (!editorViewRef.current) return;
    const { state, dispatch } = editorViewRef.current;
    const { $from, $to } = state.selection;
    const range = $from.blockRange($to);
    if (!range || !dispatch) return;
    const { paragraph } = state.schema.nodes;
    if (!paragraph) return;
    const tr = state.tr;
    tr.setBlockType(range.start, range.end, paragraph);
    dispatch(tr);
  };

  const handleBold = () => {
    if (!editorViewRef.current) return;
    const { state, dispatch } = editorViewRef.current;
    const { from, to, empty } = state.selection;

    const markType = state.schema.mark("bold").type;
    if (!markType) return;

    if (empty) {
      // If the selection is empty, toggle the mark at the cursor position
      const hasMark = !!markType.isInSet(
        state.storedMarks || state.selection.$from.marks()
      );

      if (hasMark) {
        // Remove the mark
        if (dispatch) {
          dispatch(state.tr.removeStoredMark(markType));
        }
      } else {
        // Add the mark
        if (dispatch) {
          dispatch(state.tr.addStoredMark(markType.create()));
        }
      }
      return;
    }

    // If there's a selection, toggle the mark in the range
    let hasMark = false;
    state.doc.nodesBetween(from, to, (node) => {
      if (markType.isInSet(node.marks)) {
        hasMark = true;
      }
    });

    if (dispatch) {
      if (hasMark) {
        dispatch(state.tr.removeMark(from, to, markType));
      } else {
        dispatch(state.tr.addMark(from, to, markType.create()));
      }
    }
  };

  // const isNodeActive = React.useCallback(
  //   (node: string) => {
  //     let isActive = false;
  //     if (!editorState) return isActive;

  //     const { from, to } = editorState.selection;

  //     const nodeType = editorState.schema.node(node).type;
  //     if (!nodeType) return isActive;

  //     editorState.doc.nodesBetween(from, to, (node) => {
  //       if (node.type === nodeType) {
  //         isActive = true;
  //       }
  //     });

  //     return isActive;
  //   },
  //   [editorState]
  // );

  // const isMarkActive = (mark: string): boolean => {
  //   let isActive = false;
  //   if (!editorState) return isActive;
  //   const { from, $from, to, empty } = editorState.selection;

  //   const markType = editorState.schema.mark(mark).type;
  //   if (!markType) return isActive;

  //   if (empty) {
  //     return !!markType.isInSet(editorState.storedMarks || $from.marks());
  //   } else {
  //     let isActive = false;
  //     editorState.doc.nodesBetween(from, to, (node) => {
  //       if (markType.isInSet(node.marks)) {
  //         isActive = true;
  //       }
  //     });
  //     return isActive;
  //   }
  // };

  return (
    <div className="p-2 border">
      <div className="flex gap-2">
        <NodeList view={editorViewRef.current} />
        <button
          className="p-2 rounded-md border"
          onClick={() => handleHeading(1)}
        >
          <Heading1Icon className="shrink-0 size-6" />
        </button>
        <button
          className="p-2 rounded-md border"
          onClick={() => handleHeading(2)}
        >
          <Heading2Icon className="shrink-0 size-6" />
        </button>
        <button
          className={cn(
            "p-2 rounded-md border"
            // isNodeActive("heading") ? "bg-red-500" : ""
          )}
          onClick={() => handleParagraph()}
        >
          <PilcrowIcon className="shrink-0 size-6" />
        </button>
        <button className="p-2 rounded-md border">
          <BoldIcon
            className="shrink-0 size-6"
            onClick={() => {
              handleBold();
            }}
          />
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
        className="p-2 [&>*]:outline-none [&>*]:whitespace-pre rounded border bg-white"
        ref={editorRef}
      />
    </div>
  );
};

export default EditorSimple;
