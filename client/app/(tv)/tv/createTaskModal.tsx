import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GripVerticalIcon, PlusIcon, XIcon } from "lucide-react";

import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  UniqueIdentifier,
  closestCorners,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import TipTap from "./tiptap/editor";

const SortUrl = ({ data }: { data: { url: string; id: number } }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: data.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 py-2 px-3 border rounded-md h-10 bg-background"
    >
      <GripVerticalIcon
        className="flex-shrink-0 size-4 cursor-grab"
        {...listeners}
        {...attributes}
      />
      <p className="text-sm text-muted-foreground w-full">{data.url}</p>
      <XIcon className="flex-shrink-0 size-4 cursor-pointer" />
    </div>
  );
};

const CreateTaskModal = ({
  planId,
  title,
}: {
  planId: string;
  title: string;
}) => {
  const [urls, setUrls] = React.useState<{ id: number; url: string }[]>([
    { id: 1, url: "https://example1.xyz" },
    { id: 2, url: "https://example2.xyz" },
    { id: 3, url: "https://example3.xyz" },
  ]);

  const getUrlPos = (id: UniqueIdentifier) =>
    urls.findIndex((url) => id === url.id);

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    console.log(active, over);
    if (active.id === over?.id) return;
    setUrls((prev) => {
      const originalPos = getUrlPos(active.id);
      const newPos = getUrlPos(over!.id);
      return { ...prev, urls: arrayMove(urls, originalPos, newPos) };
    });
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button type="button" className="p-2">
          <PlusIcon className="size-6 shrink-0 text-muted-foreground" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-screen-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Tạo đơn hàng</DialogTitle>
          <DialogDescription>
            Bạn đang lên đơn hàng cho <span className="font-bold">{title}</span>
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          <div className="flex flex-col gap-2 col-span-2">
            <Label htmlFor="name">Tiêu đề</Label>
            <TipTap />
          </div>
        </div>
        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Huỷ
            </Button>
          </DialogClose>
          <Button type="submit">Tạo</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTaskModal;
