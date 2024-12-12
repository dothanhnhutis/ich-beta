"use client";
import React from "react";
import { useEditor, EditorContent, ReactNodeViewRenderer } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import NodeList from "./components/node-list";
import { Underline } from "@tiptap/extension-underline";
import { GroupButtonAction } from "./components/group-button-action";
import TextAlign from "@tiptap/extension-text-align";
import { MoreAction } from "./components/more-action";
import { mergeAttributes, Node as TipTapNode } from "@tiptap/core";
import { AddProductBtn, ProductNodeView } from "./components/product-view";
import { Button } from "@/components/ui/button";
import { ImageIcon } from "lucide-react";
import Heading from "@tiptap/extension-heading";

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
  addAttributes: () => ({
    id: { default: "" },
    name: { default: "" },
    src: { default: "" },
    amount: { default: "0" },
    unit: { default: "Sản Phẩm" },
    amountOfCargoBox: { default: "0" },
  }),
  renderHTML({ HTMLAttributes, node }) {
    console.log(HTMLAttributes);
    return [
      "div",
      { "data-type": "product", class: "flex gap-2 py-2" },
      HTMLAttributes.src == ""
        ? [
            "div",
            {
              class:
                "hidden sm:flex items-center border-2 border-dashed rounded-md shrink-0 size-[100px] text-center",
            },
            [
              "svg",
              {
                class:
                  "lucide lucide-image shrink-0 size-8 text-muted-foreground mx-auto",
                width: "24",
                height: "24",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                "stroke-width": "2",
                "stroke-linecap": "round",
                "stroke-linejoin": "round",
              },
              [
                "rect",
                { width: "24", height: "24", x: "3", y: "3", rx: "2", ry: "2" },
              ],
              ["circle", { cx: "9", cy: "9", r: "2" }],
              ["path", { d: "m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" }],
            ],
          ]
        : [
            "div",
            {
              class:
                "hidden sm:block relative aspect-square size-[100px] rounded-md overflow-hidden shrink-0",
            },
            [
              "img",
              {
                src: HTMLAttributes.src,
                alt: "Product",
                loading: "lazy",
                decoding: "async",
                "data-nimg": "fill",
                class: "object-cover",
                sizes:
                  "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
                style:
                  "position: absolute; height: 100%; width: 100%; inset: 0px; color: transparent;",
              },
            ],
          ],
      [
        "div",
        { class: "w-full p-1" },
        [
          "h1",
          { class: "text-4xl font-bold line-clamp-2 md:line-clamp-1" },
          HTMLAttributes.name,
        ],
        [
          "div",
          { class: "flex items-center gap-1" },
          ["p", { class: "p-1 text-md" }],
          [
            "span",
            { class: "font-bold text-2xl" },
            ` ${node.attrs.amount} ${node.attrs.unit}`,
          ],
          node.attrs.amountOfCargoBox != "0"
            ? [
                "span",
                { class: "text-sm" },
                ` x ${node.attrs.amountOfCargoBox} SP`,
              ]
            : ["span"],
        ],
      ],
    ];
  },
  parseHTML() {
    return [
      {
        tag: "div[data-type='product']",
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
          return commands.insertContent({
            type: "product",
            attrs: {
              name: data.name,
              src: data.src,
              amount: data.amount.toString(),
              unit: data.unit,
              id: data.id,
              amountOfCargoBox: data.amountOfCargoBox.toString(),
            },
          });
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

const TiptapPage = () => {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
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
      Underline.configure({
        HTMLAttributes: {
          class: "",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      ProductNode,
    ],
    content: "<p></p>",
    onUpdate: ({ editor }) => {
      // console.log({
      //   json: JSON.stringify(editor.getJSON()),
      //   text: editor.getText(),
      //   html: editor.getHTML(),
      // });
      console.log(editor.getHTML());
    },
  });

  if (!editor) return;

  return (
    <div className="p-2 space-y-2">
      <div>
        <NodeList editor={editor} />
        <GroupButtonAction editor={editor} />
        <MoreAction editor={editor} />
        <AddProductBtn editor={editor} />
      </div>
      <EditorContent
        className="p-2 [&>*]:outline-none [&>*]:whitespace-pre-wrap rounded border bg-white min-h-[200px] max-h-[500px] overflow-y-scroll"
        editor={editor}
      />
    </div>
  );
};

export default TiptapPage;
