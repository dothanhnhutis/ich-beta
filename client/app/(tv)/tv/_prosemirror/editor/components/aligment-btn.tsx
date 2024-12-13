import React from "react";
import { useEditor } from "../editor-provider";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const AligmentBtn = ({
  alignment,
  Icon,
}: {
  alignment: "left" | "right" | "center" | "justify";
  Icon: LucideIcon;
}) => {
  const { view, state } = useEditor();

  const setTextAlignment = (
    alignment: "left" | "center" | "right" | "justify"
  ) => {
    if (!view) return;
    const { dispatch } = view;
    const { tr, selection } = state;
    const { $from, $to } = selection;

    state.doc.nodesBetween($from.pos, $to.pos, (node, pos) => {
      if (node.type.name === "paragraph" || node.type.name === "heading") {
        tr.setNodeMarkup(pos, undefined, {
          ...node.attrs,
          textAlign: alignment,
        });
      }
    });
    dispatch(tr);
  };

  const isActiveAligment = React.useMemo(() => {
    const { $from } = state.selection;
    return $from.parent.attrs.textAlign
      ? $from.parent.attrs.textAlign == alignment
      : false;
  }, [state, alignment]);

  return (
    <button
      className={cn(
        "p-2 rounded-md border",
        isActiveAligment ? "bg-red-500" : ""
      )}
      onClick={() => setTextAlignment(alignment)}
    >
      <Icon className="shrink-0 size-6" />
    </button>
  );
};

export default AligmentBtn;
