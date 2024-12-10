import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { Decoration, EditorView, NodeView } from "prosemirror-view";
import { Node } from "prosemirror-model";
import ReactDOM from "react-dom/client";
import { useEditor } from "../editor-provider";

type ProductTemp = {
  url: string;
  defaultName: string;
};

type ProductView = ProductTemp & {
  amount: number;
  unit: "Thùng" | "Sản phẩm";
};

const productView: ProductTemp[] = [
  {
    url: "https://res.cloudinary.com/dr1ntj4ar/image/upload/v1733792755/ich/z6113933456466_e226585b670b0e7de7074471d135cc0a_fk2rtu.jpg",
    defaultName: "Sản Phẩm A",
  },
  {
    url: "https://res.cloudinary.com/dr1ntj4ar/image/upload/v1733792755/ich/z6113933456466_e226585b670b0e7de7074471d135cc0a_fk2rtu.jpg",
    defaultName: "Sản Phẩm B",
  },
];
interface CustomNodeProps {
  chilren?: React.ReactNode;
}
const CustomNode = ({ chilren }: CustomNodeProps) => {
  const [data, setData] = React.useState<ProductView>({
    url: "",
    defaultName: "",
    amount: 0,
    unit: "Thùng",
  });

  return (
    <div className="flex gap-2 py-4">
      {data.url == "" ? (
        <div
          className="size-[150px] rounded-md border-dashed border-2 "
          contentEditable="false"
        >
          <button
            onClick={() =>
              setData((prev) => ({
                ...prev,
                defaultName: productView[0].defaultName,
                url: productView[0].url,
              }))
            }
          >
            select
          </button>
          <button>upload</button>
        </div>
      ) : (
        <Image
          src={data.url}
          alt="product"
          width="1000"
          height="1000"
          className="shrink-0 size-[150px] rounded-md"
        />
      )}
      <div className="flex flex-col gap-2 w-full">
        {chilren}
        <h3 className="text-4xl font-bold">{data.defaultName}</h3>
        <div className="flex items-center" contentEditable="false">
          <div className="flex gap-1 items-center bg-slate-200 rounded-lg text-2xl p-1">
            <p>Số lượng: </p>
            <input
              className="w-16 bg-transparent"
              type="text"
              value={data.amount}
              onChange={(e) => {
                const regex = /\d+/;
                if (regex.test(e.target.value))
                  setData((prev) => ({
                    ...prev,
                    amount: parseInt(e.target.value),
                  }));
              }}
            />
            Thùng
          </div>
        </div>
      </div>
    </div>
  );
};

export class ReactNodeView implements NodeView {
  dom: HTMLElement;
  contentDOM?: HTMLElement;
  root: ReactDOM.Root;

  node: Node;
  view: EditorView;
  getPos: () => number | undefined;
  decorations: readonly Decoration[];

  constructor(
    node: Node,
    view: EditorView,
    getPos: () => number | undefined,
    decorations: readonly Decoration[]
  ) {
    this.dom = document.createElement("div");
    this.root = ReactDOM.createRoot(this.dom);
    this.contentDOM = document.createElement("div");

    this.node = node;
    this.view = view;
    this.getPos = getPos;
    this.decorations = decorations;

    reactComponent;

    this.root.render(<CustomNode>{this.contentDOM}</CustomNode>);
  }

  // update(node: Node) {
  //   return true;
  // }

  // stopEvent() {
  //   return true;
  // }
  destroy() {
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
