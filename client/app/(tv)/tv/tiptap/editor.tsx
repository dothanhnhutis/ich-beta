"use client";
import React from "react";
import {
  EditorState,
  Transaction,
  Command,
  TextSelection,
  NodeSelection,
} from "prosemirror-state";
import { Schema, DOMParser, DOMSerializer } from "prosemirror-model";
import { EditorView } from "prosemirror-view";
import { keymap } from "prosemirror-keymap";
import {
  splitBlock,
  deleteSelection,
  joinBackward,
} from "prosemirror-commands";

const schema = new Schema({
  nodes: {
    doc: {
      content: "block+",
    },
    paragraph: {
      content: "inline*",
      group: "block",
      parseDOM: [{ tag: "p" }],
      toDOM: () => ["p", 0],
    },
    text: {
      group: "inline",
    },
    heading: {
      attrs: {
        level: { default: 1 },
      },

      content: "inline*",
      group: "block",
      defining: true,
      toDOM(node) {
        return [`h${node.attrs.level}`, 0]; // Render thẻ h1, h2, ..., h5
      },
      parseDOM: [
        { tag: "h1", getAttrs: () => ({ level: 1 }) },
        { tag: "h2", getAttrs: () => ({ level: 2 }) },
        { tag: "h3", getAttrs: () => ({ level: 3 }) },
        { tag: "h4", getAttrs: () => ({ level: 4 }) },
        { tag: "h5", getAttrs: () => ({ level: 5 }) },
      ],
    },
    hard_break: {
      inline: true,
      group: "inline",
      selectable: false,
      parseDOM: [{ tag: "br" }],
      toDOM: () => ["br"],
    },
  },
});

// Custom Backspace behavior function
const handleBackspace: Command = (state, dispatch) => {
  const { $anchor } = state.selection;

  // Check if we have a cursor in an empty block
  if ($anchor && $anchor.parent.content.size === 0) {
    const tr = state.tr;
    const nodeBefore = $anchor.nodeBefore;

    // If nodeBefore exists, delete the node
    if (nodeBefore) {
      tr.delete($anchor.pos - 1, $anchor.pos);
      if (dispatch) dispatch(tr);
      return true;
    }
  }

  // Fallback to default behavior
  return false;
};

// Custom keymap
const customKeymap = keymap({
  Enter: (state, dispatch, view) => {
    const { selection, schema } = state;

    // Kiểm tra xem có phải là TextSelection
    if (selection instanceof TextSelection) {
      const { $cursor } = selection;

      if (!$cursor) return splitBlock(state, dispatch);

      const { hard_break } = schema.nodes;

      if (hard_break && $cursor.parent.isTextblock) {
        const tr = state.tr;

        // // Chèn `hard_break` tại vị trí hiện tại
        // tr.insert($cursor.pos, state.schema.node("hard_break"));

        // Tách block ngay sau `hard_break`
        tr.split($cursor.pos);

        // Di chuyển con trỏ đến đầu block mới
        // const newCursorPos = tr.mapping.map($cursor.pos);
        // tr.setSelection(TextSelection.create(tr.doc, newCursorPos));
        if (dispatch) dispatch(tr);
        return true;
      }
    }

    // Kiểm tra xem có phải là NodeSelection
    if (selection instanceof NodeSelection) {
      const tr = state.tr;

      // Tách block tại vị trí node được chọn
      tr.split(selection.from);
      if (dispatch) dispatch(tr);

      return true;
    }

    // Trường hợp không phải TextSelection hoặc NodeSelection
    return splitBlock(state, dispatch);
  },
  Backspace: (state, dispatch, view) => {
    return (
      handleBackspace(state, dispatch) ||
      deleteSelection(state, dispatch) ||
      joinBackward(state, dispatch, view)
    );
  },
});

const toggleHeading =
  (level: number): Command =>
  (state, dispatch) => {
    const { selection, doc } = state;
    const { from, to } = selection;

    // Kiểm tra nếu đoạn văn bản đang được chọn có phải là heading không
    const node = doc.nodeAt(from);
    if (!node) return false;

    console.log(node.type.name);

    console.log(node);

    if (node.type.name === "heading") {
      // Nếu đã là heading, chuyển nó về paragraph
      const newNode = schema.nodes.paragraph.createAndFill();
      const transaction = state.tr.replaceWith(from, to, newNode!);
      dispatch && dispatch(transaction);
    } else {
      // Nếu là paragraph, chuyển nó thành heading với level xác định
      const newNode = schema.nodes.heading.create({ level }, [node]);
      const transaction = state.tr.replaceWith(from, to, newNode);
      dispatch && dispatch(transaction);
    }
    return true;
  };

const Editor = () => {
  const editorRef = React.useRef<HTMLDivElement | null>(null);
  const editorViewRef = React.useRef<EditorView | null>(null);

  React.useEffect(() => {
    if (!editorRef.current) return;

    const initialHTML = `<h1>This is an <strong>initial</strong> content!</h1>`;
    const contentElement = document.createElement("div");
    contentElement.innerHTML = initialHTML;

    const state = EditorState.create({
      doc: DOMParser.fromSchema(schema).parse(contentElement),
    });

    editorViewRef.current = new EditorView(editorRef.current, {
      state,
      plugins: [customKeymap],
      dispatchTransaction: (transaction) => {
        const newState = editorViewRef.current!.state.apply(transaction);
        editorViewRef.current!.updateState(newState);
      },
    });

    // Lấy text
    const text = state.doc.textContent;

    // Lấy HTML
    const serializer = DOMSerializer.fromSchema(schema);
    const fragment = serializer.serializeFragment(state.doc.content);
    const temporaryDiv = document.createElement("div");
    temporaryDiv.appendChild(fragment);
    const html = temporaryDiv.innerHTML;

    // Lấy JSON
    const json = state.doc.toJSON();

    return () => {
      if (editorViewRef.current) {
        editorViewRef.current.destroy();
        editorViewRef.current = null;
      }
    };
  }, []);

  const handleToggleHeading = (level: number) => {
    if (editorViewRef.current) {
      const state = editorViewRef.current.state;
      toggleHeading(level)(state, editorViewRef.current.dispatch);
    }
  };

  return (
    <div className="flex flex-col gap-2 border">
      <div>
        <button
          onClick={() => {
            handleToggleHeading(1);
          }}
        >
          h1
        </button>
      </div>
      <div
        ref={editorRef}
        className="ring-0 [&>.ProseMirror]:outline-none"
      ></div>
    </div>
  );
};

export default Editor;
