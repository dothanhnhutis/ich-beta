import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { Decoration, EditorView, NodeView } from "prosemirror-view";
import { Node as ProseMirrorNode } from "prosemirror-model";
import ReactDOM, { createRoot } from "react-dom/client";
import { useEditor } from "../editor-provider";

type ProductFetch = {
  url: string;
  defaultName: string;
};

const productView: ProductFetch[] = [
  {
    url: "https://res.cloudinary.com/dr1ntj4ar/image/upload/v1733792755/ich/z6113933456466_e226585b670b0e7de7074471d135cc0a_fk2rtu.jpg",
    defaultName: "Sản Phẩm A",
  },
  {
    url: "https://res.cloudinary.com/dr1ntj4ar/image/upload/v1733792755/ich/z6113933456466_e226585b670b0e7de7074471d135cc0a_fk2rtu.jpg",
    defaultName: "Sản Phẩm B",
  },
];

type ProductNodeComponentProps = {
  handleAttrChange: (newAttrs: ProductAttrs) => void;
  attrs: ProductAttrs;
  contentDOMRef: (element?: HTMLElement | null | undefined) => void;
};

const ProductNodeComponent: React.FC<ProductNodeComponentProps> = ({
  handleAttrChange,
  attrs,
  contentDOMRef,
}) => {
  const handleInputChange = (
    key: keyof ProductAttrs,
    value: string | number
  ) => {
    handleAttrChange({ ...attrs, [key]: value });
  };

  return (
    <div className="flex gap-2">
      {attrs.url == "" ? (
        <div className="border-2 border-dashed rounded-md shrink-0 size-[150px]">
          <button onClick={() => handleInputChange("url", productView[0].url)}>
            select
          </button>
        </div>
      ) : (
        <div className="relative aspect-square size-[200px] rounded-md overflow-hidden">
          <Image src={attrs.url} fill alt="Product" className="shrink-0" />
        </div>
      )}

      <div>
        <div
          ref={contentDOMRef}
          className="product-content-wrapper [&>*]:whitespace-pre-wrap"
        />

        <div className="flex items-center gap-1">
          <p>Số lượng: </p>
          <input
            type="text"
            defaultValue={attrs.amount}
            onBlur={(e) => {
              const regex = /^\d+$/;
              if (regex.test(e.target.value))
                handleInputChange("amount", parseInt(e.target.value, 10));
            }}
          />

          <button
            onClick={() =>
              handleInputChange(
                "unit",
                attrs.unit === "Thùng" ? "Sản phẩm" : "Thùng"
              )
            }
          >
            {attrs.unit}
          </button>
        </div>
      </div>
    </div>
  );
};

type ProductAttrs = {
  name: string;
  url: string;
  amount: number;
  unit: "Thùng" | "Sản phẩm";
};

export class ProductNodeView implements NodeView {
  dom: HTMLElement;
  root: ReactDOM.Root;
  node: ProseMirrorNode;
  view: EditorView;
  contentDOM?: HTMLElement | null | undefined;
  getPos: () => number | undefined;

  constructor(
    node: ProseMirrorNode,
    view: EditorView,
    getPos: () => number | undefined
  ) {
    this.node = node;
    this.view = view;
    this.getPos = getPos;

    this.dom = document.createElement("div");
    this.contentDOM = document.createElement("div");

    this.dom.className = "container";
    this.dom.appendChild(this.contentDOM);

    this.contentDOM.className = "content";

    // Create React root and render the React component

    this.root = createRoot(this.dom);
    this.root.render(
      <ProductNodeComponent
        handleAttrChange={this.updateProduct}
        attrs={this.node.attrs as ProductAttrs}
        contentDOMRef={(el) => {
          if (el && this.contentDOM) {
            el.appendChild(this.contentDOM);
          }
        }}
      />
    );
  }

  // Method to update the ProseMirror node's attributes
  updateProduct = (newAttrs: ProductAttrs) => {
    const { tr } = this.view.state;
    const pos = this.getPos();
    if (pos !== undefined) {
      this.view.dispatch(tr.setNodeMarkup(pos, undefined, newAttrs));
    }
  };

  stopEvent() {
    // Prevent ProseMirror from handling React-generated events
    return true;
  }

  destroy() {
    // Cleanup React root when the node is destroyed
    this.root.unmount();
  }
}

export const MoreBtn = ({ Icon }: { Icon: LucideIcon }) => {
  const { view, state } = useEditor();

  const handleAdd = () => {
    if (!view) return;

    const { dispatch } = view;
    const { schema, doc, tr } = state;
    const { $from, $to, from, to } = state.selection;

    const range = $from.blockRange($to);
    // const pos = selection.$cursor?.pos; // Get the cursor position

    tr.insert(0, schema.nodes.product.create({ value: "default" }));
    dispatch(tr);
  };

  return (
    <button className={cn("p-2 rounded-md border")} onClick={handleAdd}>
      <Icon className="shrink-0 size-6" />
    </button>
  );
};

export const Test = () => {
  return <div>asds</div>;
};
