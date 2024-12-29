import React from "react";
import {
  Command,
  CommandGroup,
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
import { Editor } from "@tiptap/react";

const nodeList: {
  id: number;
  label: string;
  Icon: LucideIcon;
  path: string;
  Run: (editor: Editor) => void;
  isActive: (editor: Editor) => boolean;
}[] = [
  {
    id: 1,
    label: "Heading 1",
    Icon: Heading1Icon,
    path: "h1",
    Run: (editor: Editor) => {
      editor.chain().focus().toggleHeading({ level: 1 }).run();
    },
    isActive: (editor: Editor): boolean => {
      return editor.isActive("heading", { level: 1 });
    },
  },
  {
    id: 2,
    label: "Heading 2",
    Icon: Heading2Icon,
    path: "h2",
    Run: (editor: Editor) => {
      editor.chain().focus().toggleHeading({ level: 2 }).run();
    },
    isActive: (editor: Editor): boolean => {
      return editor.isActive("heading", { level: 2 });
    },
  },
  {
    id: 3,
    label: "Heading 3",
    Icon: Heading3Icon,
    path: "h3",
    Run: (editor: Editor) => {
      editor.chain().focus().toggleHeading({ level: 3 }).run();
    },
    isActive: (editor: Editor): boolean => {
      return editor.isActive("heading", { level: 3 });
    },
  },
  {
    id: 4,
    label: "Heading 4",
    Icon: Heading4Icon,
    path: "h4",
    Run: (editor: Editor) => {
      editor.chain().focus().toggleHeading({ level: 4 }).run();
    },
    isActive: (editor: Editor): boolean => {
      return editor.isActive("heading", { level: 4 });
    },
  },
  {
    id: 5,
    label: "Paragraph",
    Icon: PilcrowIcon,
    path: "p",
    Run: (editor: Editor) => {
      editor.chain().focus().setParagraph().run();
    },
    isActive: (editor: Editor): boolean => {
      return editor.isActive("paragraph");
    },
  },
];

export const BlockList = ({ editor }: { editor: Editor }) => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState<number>(5);

  const { Icon, label } = React.useMemo(() => {
    return nodeList.find((n) => n.id == value) || nodeList[0];
  }, [value]);

  editor.on("selectionUpdate", ({ editor }) => {
    const temp = nodeList.find((a) => a.isActive(editor));
    setValue(temp?.id || 5);
  });

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between p-2"
        >
          <div className="flex items-center gap-2">
            <Icon className={cn("size-6")} />
            {label}
          </div>

          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command value="asds">
          <CommandList>
            <CommandGroup>
              {nodeList.map(({ label, Icon, Run, id }) => (
                <CommandItem
                  key={id}
                  value={label}
                  onSelect={() => {
                    Run(editor);
                    setValue(id);
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

export default BlockList;
