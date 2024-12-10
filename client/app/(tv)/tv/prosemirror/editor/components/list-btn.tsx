import { LucideIcon } from "lucide-react";
import React from "react";
import { useEditor } from "../editor-provider";
import { NodeType, Node, Fragment } from "prosemirror-model";
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
    const { schema, doc, tr } = state;
    const { $from, $to, from, to } = state.selection;

    const range = $from.blockRange($to);
    if (!range) return;

    if (!("list_item" in schema.nodes) || !(listType in schema.nodes)) return;

    const content: Node[] = [];
    doc.nodesBetween(from, to, (node) => {
      if (node.type.name === "paragraph") {
        const listItem = schema.nodes["list_item"].create({}, node);
        content.push(listItem);
      }
    });

    if (content.length === 0) return;
    const listNode = schema.nodes[listType].create({}, Fragment.from(content));

    tr.replaceRangeWith(range.start, range.end, listNode);
    tr.scrollIntoView();
    dispatch(tr);
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
