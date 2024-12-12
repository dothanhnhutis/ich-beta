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
  url: string;
  amount: number;
  unit: "Thùng" | "Sản Phẩm";
  amountOfCargoBox: number;
};

const ProductNode = TipTapNode.create({
  name: "product",
  group: "block",
  atom: true,
  addAttributes: () => ({
    id: { default: "" },
    name: { default: "" },
    url: { default: "" },
    amount: { default: "0" },
    unit: { default: "Sản Phẩm" },
    amountOfCargoBox: { default: "0" },
  }),
  renderHTML({ HTMLAttributes, node }) {
    return [
      "div",
      { "data-type": "product" },
      ["div", { "data-product": node.attrs.url }],
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
              url: data.url,
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
      StarterKit,
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
  });

  if (!editor) return;

  return (
    <div className="p-2 space-y-2">
      <div>
        <NodeList editor={editor} />
        <GroupButtonAction editor={editor} />
        <MoreAction editor={editor} />

        <AddProductBtn editor={editor} />

        {/* <Button
          type="button"
          size="icon"
          className="rounded-md"
          variant="ghost"
          onClick={() => {
            editor.commands.addProduct();
          }}
        >
          <ImageIcon className="size-5" />
        </Button> */}
      </div>
      <EditorContent
        className="p-2 [&>*]:outline-none [&>*]:whitespace-pre-wrap rounded border bg-white min-h-[200px] max-h-[500px] overflow-y-scroll"
        editor={editor}
      />
    </div>
  );
};

export default TiptapPage;
