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

const handleHeading = (view: EditorView | null, level: number) => {
  if (!view) return;
  const { state, dispatch } = view;
  const { $from, $to } = state.selection;
  const range = $from.blockRange($to);
  if (!range || !dispatch) return;
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
      handleHeading(view, 1);
    },
  },
  {
    label: "Heading 2",
    Icon: Heading2Icon,
    action: (view: EditorView | null) => {
      handleHeading(view, 2);
    },
  },
  {
    label: "Heading 3",
    Icon: Heading3Icon,
    action: (view: EditorView | null) => {
      handleHeading(view, 3);
    },
  },
  {
    label: "Heading 4",
    Icon: Heading4Icon,
    action: (view: EditorView | null) => {
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

  if (!view) return;

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
              {nodeList.map(({ label, Icon }) => (
                <CommandItem
                  key={label}
                  value={label}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <Icon
                    className={cn(
                      "size-5"
                      // value === label ? "opacity-100" : "opacity-0"
                    )}
                  />
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
