import React from "react";
import { EditorView } from "prosemirror-view";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  ChevronsUpDown,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  Heading4Icon,
  LucideIcon,
  PilcrowIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEditor } from "../editor-provider";
import { any } from "zod";

const handleHeading = (
  view: EditorView,
  nodeName: string,
  attr?: { [index: string]: any }
) => {
  const { state, dispatch } = view;
  const { $from, $to } = state.selection;
  const range = $from.blockRange($to);
  if (!range) return;
  const nodeType = state.schema.node(nodeName).type;
  if (!nodeType) return;
  const tr = state.tr;
  tr.setBlockType(range.start, range.end, nodeType, attr);
  dispatch(tr);
};

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

const nodeList: {
  label: string;
  Icon: LucideIcon;
  action: (view: EditorView | null) => void;
}[] = [
  {
    label: "Heading 1",
    Icon: Heading1Icon,
    action: (view: EditorView | null) => {
      if (!view) return;
      handleHeading(view, "heading", { level: 1 });
    },
  },
  {
    label: "Heading 2",
    Icon: Heading2Icon,
    action: (view: EditorView | null) => {
      if (!view) return;
      handleHeading(view, "heading", { level: 2 });
    },
  },
  {
    label: "Heading 3",
    Icon: Heading3Icon,
    action: (view: EditorView | null) => {
      if (!view) return;
      handleHeading(view, "heading", { level: 3 });
    },
  },
  {
    label: "Heading 4",
    Icon: Heading4Icon,
    action: (view: EditorView | null) => {
      if (!view) return;
      handleHeading(view, "heading", { level: 4 });
    },
  },
  {
    label: "Paragraph",
    Icon: PilcrowIcon,
    action: (view: EditorView | null) => {
      if (!view) return;
      handleHeading(view, "paragraph");
    },
  },
];

const NodeList = () => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  const { view } = useEditor();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? nodeList.find((node) => node.label === value)?.label
            : "Select framework..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandGroup>
              {nodeList.map(({ label, Icon, action }) => (
                <CommandItem
                  key={label}
                  value={label}
                  onSelect={(currentValue) => {
                    action(view);
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <Icon className={cn("size-6")} />
                  {label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

// const isNodeActive = React.useCallback(
//   (node: string) => {
//     let isActive = false;
//     if (!editorState) return isActive;

//     const { from, to } = editorState.selection;

//     const nodeType = editorState.schema.node(node).type;
//     if (!nodeType) return isActive;

//     editorState.doc.nodesBetween(from, to, (node) => {
//       if (node.type === nodeType) {
//         isActive = true;
//       }
//     });

//     return isActive;
//   },
//   [editorState]
// );

// const isMarkActive = (mark: string): boolean => {
//   let isActive = false;
//   if (!editorState) return isActive;
//   const { from, $from, to, empty } = editorState.selection;

//   const markType = editorState.schema.mark(mark).type;
//   if (!markType) return isActive;

//   if (empty) {
//     return !!markType.isInSet(editorState.storedMarks || $from.marks());
//   } else {
//     let isActive = false;
//     editorState.doc.nodesBetween(from, to, (node) => {
//       if (markType.isInSet(node.marks)) {
//         isActive = true;
//       }
//     });
//     return isActive;
//   }
// };

export default NodeList;
