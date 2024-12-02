import { Schema } from "prosemirror-model";

export const defaultSchema = new Schema({
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
});
