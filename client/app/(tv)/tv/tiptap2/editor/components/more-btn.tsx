import React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { EditorView, NodeView } from "prosemirror-view";
import { Node } from "prosemirror-model";
import ReactDOM from "react-dom";

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

  constructor(node: Node, view: EditorView, getPos: () => number | undefined) {
    this.dom = document.createElement("div");

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
    const root = createRoot(
      <CustomNode node={node} updateAttributes={updateAttributes} />
    );

    ReactDOM.render(
      <CustomNode node={node} updateAttributes={updateAttributes} />,
      this.dom
    );
  }

  // Called when the node view is removed from the editor
  destroy() {
    ReactDOM.unmountComponentAtNode(this.dom);
  }
}

export const MoreBtn = ({ Icon }: { Icon: LucideIcon }) => {
  return (
    <button className={cn("p-2 rounded-md border")}>
      <Icon className="shrink-0 size-6" />
    </button>
  );
};
