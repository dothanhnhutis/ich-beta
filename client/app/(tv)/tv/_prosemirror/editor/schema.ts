import { Schema } from "prosemirror-model";

const headingClassName: { class: string }[] = [
  {
    class: "font-bold text-4xl",
  },
  {
    class: "font-bold text-2xl",
  },
  {
    class: "font-bold text-xl",
  },
  {
    class: "font-bold text-lg",
  },
];

export const schemaDefault = new Schema({
  nodes: {
    doc: {
      content: "block+",
    },
    paragraph: {
      attrs: { textAlign: { default: "left" } },
      content: "inline*",
      group: "block",
      toDOM: (node) => [
        "p",
        { style: `text-align: ${node.attrs.textAlign}` },
        0,
      ],
      parseDOM: [
        {
          tag: "p",
          getAttrs: (dom: HTMLElement) => ({
            textAlign: dom.style.textAlign || "left",
          }),
        },
      ],
    },
    text: {
      group: "inline",
    },
    heading: {
      attrs: {
        level: { default: 1 },
        textAlign: { default: "left" },
      },
      content: "inline*",
      group: "block",
      defining: true,
      toDOM(node) {
        return [
          `h${node.attrs.level}`,
          {
            ...headingClassName[node.attrs.level - 1],
            style: `text-align: ${node.attrs.textAlign}`,
          },
          0,
        ];
      },
      parseDOM: [
        {
          tag: "h1",
          getAttrs: (dom: HTMLElement) => ({
            level: 1,
            textAlign: dom.style.textAlign || "left",
          }),
        },
        {
          tag: "h2",
          getAttrs: (dom: HTMLElement) => ({
            level: 2,
            textAlign: dom.style.textAlign || "left",
          }),
        },
        {
          tag: "h3",
          getAttrs: (dom: HTMLElement) => ({
            level: 3,
            textAlign: dom.style.textAlign || "left",
          }),
        },
        {
          tag: "h4",
          getAttrs: (dom: HTMLElement) => ({
            level: 4,
            textAlign: dom.style.textAlign || "left",
          }),
        },
        {
          tag: "h5",
          getAttrs: (dom: HTMLElement) => ({
            level: 5,
            textAlign: dom.style.textAlign || "left",
          }),
        },
        {
          tag: "h6",
          getAttrs: (dom: HTMLElement) => ({
            level: 6,
            textAlign: dom.style.textAlign || "left",
          }),
        },
      ],
    },
    hard_break: {
      inline: true,
      group: "inline",
      selectable: false,
      parseDOM: [{ tag: "br" }],
      toDOM: () => ["br"],
    },
    bullet_list: {
      group: "block",
      content: "list_item+",
      parseDOM: [{ tag: "ul" }],
      toDOM: () => ["ul", 0],
    },
    ordered_list: {
      group: "block",
      content: "list_item+",
      attrs: { order: { default: 1 } },
      parseDOM: [
        {
          tag: "ol",
          getAttrs: (dom: HTMLElement) => ({
            order: dom.hasAttribute("start")
              ? Number(dom.getAttribute("start"))
              : 1,
          }),
        },
      ],
      toDOM: (node) =>
        node.attrs.order === 1
          ? ["ol", 0]
          : ["ol", { start: node.attrs.order }, 0],
    },
    list_item: {
      content: "(paragraph | ordered_list | bullet_list){1}",
      group: "block",
      parseDOM: [{ tag: "li" }],
      toDOM: () => ["li", 0],
    },

    product_title: {
      content: "(heading | paragraph)",
      toDOM: () => ["div", { "data-node-type": "product-title" }, 0],
      parseDOM: [{ tag: "div[data-node-type='product-title']" }],
    },
    product: {
      group: "block",
      content: "product_title+",
      attrs: {
        name: { default: "" },
        url: {
          default:
            "https://res.cloudinary.com/dr1ntj4ar/image/upload/v1733792755/ich/z6113933456466_e226585b670b0e7de7074471d135cc0a_fk2rtu.jpg",
        },
        amount: { default: 0 },
        unit: { default: "Thùng" },
      },
      toDOM: (node) => [
        "div",
        {
          "data-node-type": "product",
          "data-name": node.attrs.name,
          "data-amount": node.attrs.amount,
          "data-unit": node.attrs.unit,
          "data-url": node.attrs.url,
        },
        0,
      ],
      parseDOM: [
        {
          tag: "div[data-node-type='product']",
          getAttrs: (dom) => ({
            name: dom.getAttribute("data-name") || "",
            amount: dom.getAttribute("data-amount") || "",
            unit: dom.getAttribute("data-unit") || "",
            url: dom.getAttribute("data-url") || "",
          }),
        },
      ],
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
