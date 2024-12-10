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
};

const ProductNodeComponent: React.FC<ProductNodeComponentProps> = ({
  handleAttrChange,
  attrs,
}) => {
  const handleInputChange = (
    key: keyof ProductAttrs,
    value: string | number
  ) => {
    handleAttrChange({ ...attrs, [key]: value });
  };

  return (
    <div className="product-node">
      {/* Editable name */}
      <div
        contentEditable="true"
        suppressContentEditableWarning
        onBlur={(e) =>
          handleInputChange("name", e.currentTarget.textContent || "")
        }
      >
        {attrs.name}
      </div>

      {/* Image selection/upload */}
      <div className="product-image">
        <img src={attrs.url || "placeholder.jpg"} alt="Product" />
        <button
          onClick={() => handleInputChange("url", prompt("Enter URL:") || "")}
        >
          Upload/Select Image
        </button>
      </div>

      {/* Editable amount */}
      <input
        type="number"
        value={attrs.amount}
        onChange={(e) =>
          handleInputChange("amount", parseInt(e.target.value, 10))
        }
      />

      {/* Unit toggle */}
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
  getPos: () => number | undefined;

  constructor(
    node: ProseMirrorNode,
    view: EditorView,
    getPos: () => number | undefined
  ) {
    this.dom = document.createElement("div");
    this.node = node;
    this.view = view;
    this.getPos = getPos;

    // Create React root and render the React component
    this.root = createRoot(this.dom);
    this.root.render(
      <ProductNodeComponent
        handleAttrChange={this.updateProduct}
        attrs={this.node.attrs as ProductAttrs}
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
