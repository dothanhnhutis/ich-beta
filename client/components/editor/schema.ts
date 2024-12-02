// import { NodeSpec, MarkSpec, Schema } from "prosemirror-model";

// interface INode extends NodeSpec {
//   name: string;
//   type: "node";
// }

// interface IMark extends MarkSpec {
//   name: string;
//   type: "mark";
// }

// // export class Mark {
// //   name: string;
// //   type: "mark" = "mark";
// //   schema: MarkSpec;

// //   constructor(name: string, schema: MarkSpec) {
// //     this.name = name;
// //     this.schema = schema;
// //   }

// //   static create({ name, ...props }: IMark) {
// //     return new Mark(name, props);
// //   }
// // }

// // export class Node {
// //   name: string;
// //   type: "node" = "node";
// //   schema: NodeSpec;

// //   constructor(name: string, schema: NodeSpec) {
// //     this.name = name;
// //     this.schema = schema;
// //   }

// //   static create({ name, ...props }: INode) {
// //     return new Node(name, props);
// //   }
// // }

// // export const defaultSchema = new Schema({
// //   nodes: {
// //     doc: {
// //       content: "block+",
// //     },
// //     paragraph: {
// //       content: "inline*",
// //       group: "block",
// //       parseDOM: [{ tag: "p" }],
// //       toDOM: () => ["p", 0],
// //     },
// //     text: {
// //       group: "inline",
// //     },
// //     heading: {
// //       attrs: {
// //         level: { default: 1 },
// //       },
// //       content: "inline*",
// //       group: "block",
// //       defining: true,
// //       toDOM(node) {
// //         return [`h${node.attrs.level}`, 0];
// //       },
// //       parseDOM: [
// //         { tag: "h1", getAttrs: () => ({ level: 1 }) },
// //         { tag: "h2", getAttrs: () => ({ level: 2 }) },
// //         { tag: "h3", getAttrs: () => ({ level: 3 }) },
// //         { tag: "h4", getAttrs: () => ({ level: 4 }) },
// //         { tag: "h5", getAttrs: () => ({ level: 5 }) },
// //         { tag: "h6", getAttrs: () => ({ level: 6 }) },
// //       ],
// //     },
// //     hard_break: {
// //       inline: true,
// //       group: "inline",
// //       selectable: false,
// //       parseDOM: [{ tag: "br" }],
// //       toDOM: () => ["br"],
// //     },
// //   },
// // });

// export class Mark {
//   name: string;
//   type: "mark" = "mark";
//   schema: MarkSpec;

//   constructor(name: string, schema: MarkSpec) {
//     this.name = name;
//     this.schema = schema;
//   }

//   static create({ name, ...props }: IMark) {
//     return new Mark(name, props);
//   }
// }

// export class Node {
//   name: string;
//   type: "node" = "node";
//   schema: NodeSpec;

//   constructor(name: string, schema: NodeSpec) {
//     this.name = name;
//     this.schema = schema;
//   }

//   static create({ name, ...props }: INode) {
//     return new Node(name, props);
//   }
// }

// // CreateSchema function with inferred types
// function createSchema<
//   N extends string,
//   M extends string
// >(extensions: (Node | Mark)[]): Schema<N, M> {
//   const nodes: Record<string, NodeSpec> = {};
//   const marks: Record<string, MarkSpec> = {};

//   for (const extension of extensions) {
//     if (extension instanceof Node) {
//       nodes[extension.name] = extension.schema;
//     } else if (extension instanceof Mark) {
//       marks[extension.name] = extension.schema;
//     }
//   }

//   return new Schema<N, M>({ nodes, marks });
// }

// // Usage
// const extensions = [
//   Node.create({ name: "paragraph", content: "inline*", group: "block" }),
//   Mark.create({ name: "bold", toDOM: () => ["strong", 0] }),
// ] as const;

// const schema = createSchema<typeof extensions[number]["name"], typeof extensions[number]["name"]>(
//   extensions
// );

// console.log(schema);

import { Schema, NodeSpec, MarkSpec } from "prosemirror-model";

// Define Node and Mark classes
export class Mark {
  name: string;
  type: "mark" = "mark";
  schema: MarkSpec;

  constructor(name: string, schema: MarkSpec) {
    this.name = name;
    this.schema = schema;
  }

  static create(name: string, schema: MarkSpec) {
    return new Mark(name, schema);
  }
}

export class Node {
  name: string;
  type: "node" = "node";
  schema: NodeSpec;

  constructor(name: string, schema: NodeSpec) {
    this.name = name;
    this.schema = schema;
  }

  static create(name: string, schema: NodeSpec) {
    return new Node(name, schema);
  }
}

// Function to create Schema using Node and Mark types
function createSchema<
  N extends { [key: string]: NodeSpec },
  M extends { [key: string]: MarkSpec }
>(nodes: N, marks: M): Schema<keyof N, keyof M> {
  return new Schema({ nodes, marks });
}

// Example usage
const nodes: { readonly [index: string]: NodeSpec } = {
  paragraph: { content: "inline*", group: "block" } as NodeSpec,
  heading: {
    content: "inline*",
    group: "block",
    attrs: { level: { default: 1 } },
  } as NodeSpec,
} as const;

const marks = {
  bold: { toDOM: () => ["strong", 0] } as MarkSpec,
  italic: { toDOM: () => ["em", 0] } as MarkSpec,
} as const;

// Create schema
const schema = createSchema(nodes, marks);

// Expected result: Schema<"paragraph" | "heading", "bold" | "italic">
console.log(schema);
