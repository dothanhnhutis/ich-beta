import { LucideIcon } from "lucide-react";
import React from "react";
import { useEditor } from "../editor-provider";
import { NodeType } from "prosemirror-model";
import { Command, EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";

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
    const { schema, doc } = state;

    const { $from, $to, from, to } = state.selection;
    const range = $from.blockRange($to);
    if (!range) return;

    if (
      !("list_item" in view.state.schema.nodes) ||
      !(listType in view.state.schema.nodes)
    )
      return;

    const tr = state.tr;

    doc.nodesBetween(from, to, (node, pos, _, idx) => {
      console.log(`Node at position ${pos}:`, node, idx);
      // state.tr.wrap(range, [
      //   // { type: state.schema.nodes.ordered_list },
      //   { type: state.schema.nodes.list_item },
      // ]);
    });

    // tr.replaceWith(
    //   0,
    //   5,
    //   schema.nodes.list_item.createAndFill(
    //     null,
    //     range.parent.content.content[0]
    //   )!
    // );

    // console.log(tr.mapping.map(5));

    // dispatch(
    // state.tr.wrap(range, [
    //   // { type: state.schema.nodes.ordered_list },
    //   { type: state.schema.nodes.list_item },
    // ])
    // );

    // tr.replaceWith(
    //   6,
    //   11,
    //   schema.nodes.list_item.createAndFill(
    //     null,
    //     range.parent.content.content[1]
    //   )!
    // );

    // if (range.parent.type.name === "list_item") {
    //   // tr.lift(range, 0);
    //   // dispatch(tr);
    // } else {
    //   // dispatch(
    //   //   state.tr.wrap(range, [
    //   //     { type: state.schema.nodes[listType] },
    //   //     { type: state.schema.nodes.list_item },
    //   //   ])
    //   // );
    //   // range.parent.content.content.forEach((node, offset) => {
    //   //   // const from = range.start + offset;
    //   //   // const to = from + node.nodeSize;
    //   //   console.log("offset", offset);
    //   //   console.log("start", range.start, "end", range.end);
    //   //   // tr.replaceWith(
    //   //   //   from,
    //   //   //   to,
    //   //   //   schema.nodes.list_item.createAndFill(null, node)!
    //   //   // );
    //   // });
    //   // tr.replaceWith(
    //   //   0,
    //   //   5,
    //   //   schema.nodes.list_item.createAndFill(
    //   //     null,
    //   //     range.parent.content.content[0]
    //   //   )!
    //   // );
    //   // dispatch(tr);
    // }

    // const isInList = range.depth >= 1 && range.parent.type.name === listType;

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
      onClick={() => handleSetList("bullet_list")}
    >
      <Icon className="shrink-0 size-6" />
    </button>
  );
};

export default ListBtn;
