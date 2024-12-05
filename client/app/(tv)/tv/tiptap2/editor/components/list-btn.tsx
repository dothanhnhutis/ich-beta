import { LucideIcon } from "lucide-react";
import React from "react";
import { useEditor } from "../editor-provider";

const ListBtn = ({
  listType,
  Icon,
}: {
  listType: "bullet_list" | "ordered_list";
  Icon: LucideIcon;
}) => {
  const { view, state } = useEditor();

  const handleSetList = (listType: "bullet_list" | "ordered_list") => {
    if (!view) return;
    const { dispatch } = view;
    const { $from, $to } = state.selection;
    const range = $from.blockRange($to);

    if (!range) return;

    if (
      !("list_item" in state.schema.nodes) ||
      !(listType in state.schema.nodes)
    )
      return;
    console.log(state.schema.nodes[listType]);
    console.log(state.schema);

    dispatch(
      state.tr.wrap(range, [
        { type: state.schema.nodes[listType] },
        { type: state.schema.nodes.list_item },
      ])
    );
  };
  return (
    <button
      className="p-2 rounded-md border"
      onClick={() => handleSetList(listType)}
    >
      <Icon className="shrink-0 size-6" />
    </button>
  );
};

export default ListBtn;
