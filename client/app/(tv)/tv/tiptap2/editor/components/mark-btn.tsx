import { EditorView } from "prosemirror-view";
import { useEditor } from "../editor-provider";
import { BoldIcon, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import React from "react";
const handleBold = (view: EditorView) => {
  const { state, dispatch } = view;
  const { from, to, empty } = state.selection;

  const markType = state.schema.mark("bold").type;
  if (!markType) return;

  if (empty) {
    // If the selection is empty, toggle the mark at the cursor position
    const hasMark = !!markType.isInSet(
      state.storedMarks || state.selection.$from.marks()
    );

    if (hasMark) {
      // Remove the mark
      if (dispatch) {
        dispatch(state.tr.removeStoredMark(markType));
      }
    } else {
      // Add the mark
      if (dispatch) {
        dispatch(state.tr.addStoredMark(markType.create()));
      }
    }
    return;
  }

  // If there's a selection, toggle the mark in the range
  let hasMark = false;
  state.doc.nodesBetween(from, to, (node) => {
    if (markType.isInSet(node.marks)) {
      hasMark = true;
    }
  });

  if (dispatch) {
    if (hasMark) {
      dispatch(state.tr.removeMark(from, to, markType));
    } else {
      dispatch(state.tr.addMark(from, to, markType.create()));
    }
  }
};

export const MarkBtn = ({ mark, Icon }: { mark: string; Icon: LucideIcon }) => {
  const { view, state } = useEditor();

  const handleAddMark = (mark: string) => {
    if (!view) return;
    const { dispatch } = view;
    const { schema } = state;
    if (!(mark in schema.marks)) return;
    const markType = schema.mark(mark).type;
    const { from, to, empty } = state.selection;

    if (empty) {
      // If the selection is empty, toggle the mark at the cursor position
      const hasMark = !!markType.isInSet(
        state.storedMarks || state.selection.$from.marks()
      );
      if (hasMark) return;
      if (dispatch) {
        dispatch(state.tr.addStoredMark(markType.create()));
      }
    } else {
      dispatch(state.tr.addMark(from, to, markType.create()));
    }
  };

  const handleRemoveMark = (mark: string) => {
    if (!view) return;
    const { dispatch } = view;
    const { schema } = state;
    if (!(mark in schema.marks)) return;
    const markType = schema.mark(mark).type;
    const { from, to, empty } = state.selection;

    if (empty) {
      // If the selection is empty, toggle the mark at the cursor position
      const hasMark = !!markType.isInSet(
        state.storedMarks || state.selection.$from.marks()
      );
      if (!hasMark) return;
      if (dispatch) {
        dispatch(state.tr.removeStoredMark(markType.create()));
      }
    } else {
      dispatch(state.tr.removeMark(from, to, markType.create()));
    }
  };

  const handleToggleMark = (mark: string) => {
    if (!view) return;
    const { dispatch } = view;
    const { schema } = state;
    if (!(mark in schema.marks)) return;
    const markType = schema.mark(mark).type;
    const { from, to, empty } = state.selection;

    if (empty) {
      // If the selection is empty, toggle the mark at the cursor position
      const hasMark = !!markType.isInSet(
        state.storedMarks || state.selection.$from.marks()
      );
      if (hasMark) {
        dispatch(state.tr.removeStoredMark(markType.create()));
      } else {
        dispatch(state.tr.addStoredMark(markType.create()));
      }
    } else {
      let hasMark = false;
      state.doc.nodesBetween(from, to, (node) => {
        if (markType.isInSet(node.marks)) {
          hasMark = true;
        }
      });

      if (hasMark) {
        dispatch(state.tr.removeMark(from, to, markType));
      } else {
        dispatch(state.tr.addMark(from, to, markType.create()));
      }
    }
  };

  const isActiveMark = React.useMemo(() => {
    const { schema } = state;
    const { from, to, empty } = state.selection;
    if (!(mark in schema.marks)) return false;
    const markType = schema.mark(mark).type;

    if (empty) {
      return !!markType.isInSet(
        state.storedMarks || state.selection.$from.marks()
      );
    } else {
      let hasMark = false;
      state.doc.nodesBetween(from, to, (node) => {
        if (markType.isInSet(node.marks)) {
          hasMark = true;
        }
      });
      return hasMark;
    }
  }, [state, mark]);

  return (
    <button
      className={cn("p-2 rounded-md border", isActiveMark ? "bg-red-500" : "")}
      onClick={() => handleToggleMark(mark)}
    >
      <Icon className="shrink-0 size-6" />
    </button>
  );
};
