import { Schema } from "prosemirror-model";

export const schemaDefault = new Schema({
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
        return [`h${node.attrs.level}`, 0];
      },
      parseDOM: [
        { tag: "h1", getAttrs: () => ({ level: 1 }) },
        { tag: "h2", getAttrs: () => ({ level: 2 }) },
        { tag: "h3", getAttrs: () => ({ level: 3 }) },
        { tag: "h4", getAttrs: () => ({ level: 4 }) },
        { tag: "h5", getAttrs: () => ({ level: 5 }) },
        { tag: "h6", getAttrs: () => ({ level: 6 }) },
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
  marks: {
    bold: {
      parseDOM: [
        {
          tag: "strong",
        },
        {
          tag: "b",
          getAttrs: (node) =>
            (node as HTMLElement).style.fontWeight !== "normal" && null,
        },
        {
          style: "font-weight=400",
          clearMark: (mark) => mark.type.name === "bold",
        },
        {
          style: "font-weight",
          getAttrs: (value) =>
            /^(bold(er)?|[5-9]\d{2,})$/.test(value as string) && null,
        },
      ],
      toDOM(node) {
        return ["strong", 0];
      },
    },
    italic: {
      parseDOM: [
        {
          tag: "em",
        },
        {
          tag: "i",
          getAttrs: (node) =>
            (node as HTMLElement).style.fontStyle !== "normal" && null,
        },
        {
          style: "font-style=normal",
          clearMark: (mark) => mark.type.name === "italic",
        },
        {
          style: "font-style=italic",
        },
      ],
      toDOM(node) {
        return ["em", 0];
      },
    },
    underline: {
      parseDOM: [
        {
          tag: "u",
        },
        {
          style: "text-decoration",
          consuming: false,
          getAttrs: (style) =>
            (style as string).includes("underline") ? {} : false,
        },
      ],
      toDOM() {
        return ["u", 0];
      },
    },
    strike: {
      parseDOM: [
        {
          tag: "s",
        },
        {
          tag: "del",
        },
        {
          tag: "strike",
        },
        {
          style: "text-decoration",
          consuming: false,
          getAttrs: (style) =>
            (style as string).includes("line-through") ? {} : false,
        },
      ],
      toDOM() {
        return ["s", 0];
      },
    },
  },
});
