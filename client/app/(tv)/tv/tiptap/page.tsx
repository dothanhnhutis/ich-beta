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
import ProductNodeView from "./components/product-view";
import { Button } from "@/components/ui/button";
import { ImageIcon } from "lucide-react";
import Heading from "@tiptap/extension-heading";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    customExtension: {
      addProduct: () => ReturnType;
    };
  }
}

const ProductNode = TipTapNode.create({
  name: "product",
  group: "block",
  atom: true,
  addAttributes: () => ({
    name: { default: "" },
    unit: { default: "Thùng" },
    amount: { default: "0" },
    url: { default: "" },
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
      addProduct() {
        return ({ commands }) => {
          return commands.insertContent({
            type: "product",
            attrs: {
              name: "Năm Á À Ấ Ầ Ằ Ắ, có thể xem là thời kỳ đỉnh cao trong sự nghiệp của anh. Vào tháng 1 năm 2018, anh nhận được số tiền ủng hộ từ một người hâm mộ mang tên Bunngan.com với tổng số tiền lên tới 80 triệu đồng. Điều này khiến cho anh chàng vô cùng xúc động, thậm chí còn không dám tin vào mắt mình.[8] 9 tháng sau đó, anh chàng lại tiếp tục bàng hoàng với màn donate vô tiền khoáng hậu từ phía người hâm mộ mang tên Khang Nade. Tổng số tiền anh nhận trong buổi stream tối hôm đó lên tới 63 triệu đồng.[8] Một năm sau đó, trong tháng 9, Độ Mixi lại tiếp tục được nhận số tiền donate lớn từ",
              url: "https://res.cloudinary.com/dr1ntj4ar/image/upload/v1733792755/ich/z6113933456466_e226585b670b0e7de7074471d135cc0a_fk2rtu.jpg",
              amount: "200",
              unit: "Thùng",
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
        <Button
          type="button"
          size="icon"
          className="rounded-md"
          variant="ghost"
          onClick={() => {
            editor.commands.addProduct();
          }}
        >
          <ImageIcon className="size-5" />
        </Button>
      </div>
      <EditorContent
        className="p-2 [&>*]:outline-none [&>*]:whitespace-pre-wrap rounded border bg-white min-h-[200px] max-h-[500px] overflow-y-scroll"
        editor={editor}
      />
    </div>
  );
};

export default TiptapPage;
