import React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { EditorView, NodeView } from "prosemirror-view";
import { Node } from "prosemirror-model";
import ReactDOM from "react-dom/client";
import { useEditor } from "../editor-provider";

interface CustomNodeProps {
  node: any;
  updateAttributes: (attrs: Record<string, any>) => void;
}

const CustomNode = ({ node, updateAttributes }: CustomNodeProps) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateAttributes({ value: event.target.value });
  };

  return (
    <div contentEditable={false}>
      <input
        type="text"
        value={node.attrs.value || ""}
        onChange={handleChange}
      />
    </div>
  );
};

export class ReactNodeView implements NodeView {
  dom: HTMLElement;
  contentDOM?: HTMLElement;
  root: ReactDOM.Root;

  constructor(node: Node, view: EditorView, getPos: () => number | undefined) {
    this.dom = document.createElement("div");

    // Update attributes when they change
    const updateAttributes = (attrs: Record<string, any>) => {
      const transaction = view.state.tr.setNodeMarkup(
        getPos() || 0,
        undefined,
        {
          ...node.attrs,
          ...attrs,
        }
      );
      view.dispatch(transaction);
    };

    // Render the React component
    this.root = ReactDOM.createRoot(this.dom);
    this.root.render(
      <CustomNode node={node} updateAttributes={updateAttributes} />
    );
  }

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
