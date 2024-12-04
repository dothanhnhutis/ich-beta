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

const handleHeading = (view: EditorView, level: number) => {
  const { state, dispatch } = view;
  const { $from, $to } = state.selection;
  const range = $from.blockRange($to);
  if (!range) return;
  const { heading } = state.schema.nodes;
  if (!heading) return;
  const tr = state.tr;
  tr.setBlockType(range.start, range.end, heading, { level });
  dispatch(tr);
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
      handleHeading(view, 1);
    },
  },
  {
    label: "Heading 2",
    Icon: Heading2Icon,
    action: (view: EditorView | null) => {
      if (!view) return;
      handleHeading(view, 2);
    },
  },
  {
    label: "Heading 3",
    Icon: Heading3Icon,
    action: (view: EditorView | null) => {
      if (!view) return;
      handleHeading(view, 3);
    },
  },
  {
    label: "Heading 4",
    Icon: Heading4Icon,
    action: (view: EditorView | null) => {
      if (!view) return;
      handleHeading(view, 4);
    },
  },
  //   {
  //     label: "Paragraph",
  //     Icon: PilcrowIcon,
  //   },
];

const NodeList = ({ view }: { view: EditorView | null }) => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

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

export default NodeList;
