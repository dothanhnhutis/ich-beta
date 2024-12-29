import {
  Extensions,
  // generateHTML,
  // generateJSON,
  mergeAttributes,
  Node as TipTapNode,
} from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Heading from "@tiptap/extension-heading";
import { Underline } from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { ProductNodeView } from "./product-view";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    customExtension: {
      addProduct: (data: ProductNodeData) => ReturnType;
    };
  }
}

export type ProductNodeData = {
  id: string;
  name: string;
  src: string;
  amount: number;
  unit: "Thùng" | "Sản Phẩm";
  amountOfCargoBox: number;
};

const ProductNode = TipTapNode.create({
  name: "product",
  group: "block",
  atom: true,
  addAttributes: () => ({
    id: {
      default: "",
      parseHTML(e) {
        return e.getAttribute("id");
      },
    },
    name: {
      default: "",
      parseHTML(e) {
        return e.getAttribute("name");
      },
    },
    src: {
      default: "",
      parseHTML(e) {
        return e.getAttribute("src");
      },
    },
    amount: {
      default: "0",
      parseHTML(e) {
        return e.getAttribute("amount");
      },
    },
    unit: {
      default: "Sản Phẩm",
      parseHTML(e) {
        return e.getAttribute("unit");
      },
    },
    amountOfCargoBox: {
      default: "0",
      parseHTML(e) {
        return e.getAttribute("amountOfCargoBox");
      },
    },
  }),
  renderHTML({ node, HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        class: "flex gap-2 py-2",
        "data-type": "product",
      }),
      [
        "div",
        {
          class:
            "hidden sm:block relative aspect-square size-[100px] rounded-md overflow-hidden shrink-0",
        },
        [
          "img",
          {
            src: node.attrs.src,
            alt: node.attrs.name,
            class: "h-full w-full object-cover",
          },
        ],
      ],
      [
        "div",
        { class: "w-full p-1" },
        [
          "h2",
          { class: "text-4xl font-bold line-clamp-2 md:line-clamp-1" },
          node.attrs.name,
        ],
        node.attrs.unit == "Sản Phẩm"
          ? [
              "div",
              { class: "flex items-center gap-1" },
              [
                "p",
                { class: "p-1 text-md" },
                ["span", {}, "SL:"],
                [
                  "span",
                  { class: "font-bold text-2xl" },
                  `${node.attrs.amount} ${node.attrs.unit}`,
                ],
              ],
            ]
          : [
              "div",
              { class: "flex items-center gap-1" },
              [
                "p",
                { class: "p-1 text-md" },
                ["span", {}, "SL: "],
                [
                  "span",
                  { class: "font-bold text-2xl" },
                  `${node.attrs.amount} ${node.attrs.unit}`,
                ],
                [
                  "span",
                  { class: "text-sm" },
                  ` x ${node.attrs.amountOfCargoBox} SP`,
                ],
              ],
            ],
      ],
    ];
  },
  parseHTML() {
    return [
      {
        tag: "div[data-type=product]",
      },
    ];
  },
  addNodeView() {
    return ReactNodeViewRenderer(ProductNodeView);
  },
  addCommands() {
    return {
      addProduct(data: ProductNodeData) {
        return ({ commands }) => {
          return commands.insertContent(
            [
              {
                type: "product",
                attrs: {
                  name: data.name,
                  src: data.src,
                  amount: data.amount.toString(),
                  unit: data.unit,
                  id: data.id,
                  amountOfCargoBox: data.amountOfCargoBox.toString(),
                },
              },
            ],
            {
              parseOptions: {
                preserveWhitespace: false,
              },
            }
          );
        };
      },
    };
  },
});

type Levels = 1 | 2 | 3 | 4;

const classes: Record<Levels, string> = {
  1: "scroll-m-20 text-5xl font-extrabold tracking-tight ",
  2: "scroll-m-20 text-4xl font-semibold tracking-tight ",
  3: "scroll-m-20 text-3xl font-semibold tracking-tight",
  4: "scroll-m-20 text-2xl font-semibold tracking-tight",
};

export const extensions: Extensions = [
  StarterKit.configure({
    heading: false,
  }),
  Heading.extend({
    renderHTML({ node, HTMLAttributes }) {
      const hasLevel = this.options.levels.includes(node.attrs.level);
      const level: Levels = hasLevel
        ? node.attrs.level
        : this.options.levels[0];

      return [
        `h${level}`,
        mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
          class: `${classes[level]}`,
        }),
        0,
      ];
    },
  }),
  Underline,
  TextAlign.configure({
    types: ["heading", "paragraph"],
  }),
  ProductNode,
];
