import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { Decoration, EditorView, NodeView } from "prosemirror-view";
import { Node } from "prosemirror-model";
import ReactDOM from "react-dom/client";
import { useEditor } from "../editor-provider";

interface CustomNodeProps {
  node: any;
}

const CustomNode = ({ node }: CustomNodeProps) => {
  const [number, setNumber] = React.useState<number>(0);
  const handleChange = () => {
    setNumber(number + 1);
  };
  return (
    <div className="flex gap-2 py-4">
      <Image
        src="/product-list/product1.jpg"
        alt="product"
        width="1000"
        height="1000"
        className="shrink-0 size-[200px]"
      />
      <div className="flex flex-col gap-2 w-full">
        <h3 className="text-4xl font-bold">
          thành nhựt Thành Tổ When adding steps to a transaction for content
          changes thành nhựt Thành Tổ When adding steps to a transaction for
          content changes
        </h3>
        <div className="flex items-center">
          <p className="rounded-lg text-2xl bg-slate-300 inline p-2 shadow-md">
            Số lượng: 3000 Thùng
          </p>
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
    this.dom = document.createElement("h1");
    this.root = ReactDOM.createRoot(this.dom);
    // this.contentDOM = document.createElement("div");

    this.node = node;
    this.view = view;
    this.getPos = getPos;
    this.decorations = decorations;

    this.root.render(<CustomNode node={node} />);
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
