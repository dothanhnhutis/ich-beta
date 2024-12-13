import { TextSelection, NodeSelection, Command } from "prosemirror-state";
import { keymap } from "prosemirror-keymap";
import {
  splitBlock,
  deleteSelection,
  joinBackward,
} from "prosemirror-commands";

const handleBackspace: Command = (state, dispatch) => {
  const { selection } = state;
  if (selection instanceof TextSelection) {
    const { $cursor } = selection;
    if ($cursor && $cursor.parent.content.size === 0) {
      // Check if we have a cursor in an empty block
      const tr = state.tr;
      const nodeBefore = $cursor.nodeBefore;
      // If nodeBefore exists, delete the node
      if (nodeBefore) {
        tr.delete($cursor.pos - 1, $cursor.pos);
        if (dispatch) dispatch(tr);
        return true;
      }
    }
  }
  return false;
};

// Custom keymap
export const defaultKeymap = keymap({
  Enter: (state, dispatch) => {
    const { selection } = state;
    // Kiểm tra xem có phải là TextSelection
    if (selection instanceof TextSelection) {
      const { $cursor } = selection;
      if (!$cursor) return splitBlock(state, dispatch);
      const tr = state.tr;

      tr.split($cursor.pos);

      if (dispatch) dispatch(tr);
      return true;
    }
    // Kiểm tra xem có phải là NodeSelection
    if (selection instanceof NodeSelection) {
      const tr = state.tr;
      // Tách block tại vị trí node được chọn
      tr.split(selection.from);
      if (dispatch) dispatch(tr);
      return true;
    }
    // Trường hợp không phải TextSelection hoặc NodeSelection
    return splitBlock(state, dispatch);
  },
  Backspace: (state, dispatch, view) => {
    return (
      handleBackspace(state, dispatch) ||
      deleteSelection(state, dispatch) ||
      joinBackward(state, dispatch, view)
    );
  },
});
