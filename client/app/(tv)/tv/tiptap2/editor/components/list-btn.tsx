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

    const isInList = range.depth >= 1 && range.parent.type.name === listType;
    if (isInList) {
      // Unwrap the list
      if (dispatch) {
        const tr = state.tr;
        const target = liftTarget(range);
        if (target !== null) {
          tr.lift(range, target);
        }
        dispatch(tr);
      }
      return true;
    } else {
      // Wrap in the target list
      const wrapping = findWrapping(range, listType, {}, itemType);

      if (!wrapping) return false;

      if (dispatch) {
        const tr = state.tr;
        tr.wrap(range, wrapping);
        dispatch(tr);
      }
      return true;
    }
    // if (
    //   !("list_item" in state.schema.nodes) ||
    //   !(listType in state.schema.nodes)
    // )
    //   return;

    // const parentList = range.parent.type;

    // if (parentList.name == "list_item") {
    //   console.log("first");
    //   dispatch(
    //     state.tr.setNodeMarkup(range.start, state.schema.nodes.paragraph)
    //   );
    // } else {
    //   dispatch(
    //     state.tr.wrap(range, [
    //       { type: state.schema.nodes[listType] },
    //       { type: state.schema.nodes.list_item },
    //     ])
    //   );
    // }
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
