"use client";
import { Editor, EditorContent, useEditor } from "@tiptap/react";
import React from "react";
import { extensions } from "./components/schema";
import { AddProductBtn } from "./components/product-view";
import { MoreAction } from "./components/more-action";
import { GroupButtonAction } from "./components/group-button-action";
import BlockList from "./components/block-list";
import { Skeleton } from "../ui/skeleton";
import { cn } from "@/lib/utils";

const DisplayEditor = ({
  onEditorChange,
  content,
  disabled,
}: {
  content?: string;
  onEditorChange?: (editor: Editor) => void;
  disabled?: boolean;
}) => {
  const editor = useEditor({
    immediatelyRender: false,
    extensions,
    content: content || `<p></p>`,
    onUpdate: ({ editor }) => {
      if (onEditorChange) onEditorChange(editor);
    },
  });
  if (!editor)
    return (
      <div className="border rounded-lg">
        <div className="border-b p-1 flex items-center gap-1 flex-wrap">
          <Skeleton className="h-10 w-[200px] rounded-lg" />
          <Skeleton className="size-10 rounded-full" />
          <Skeleton className="size-10 rounded-full" />
          <Skeleton className="size-10 rounded-full" />
          <Skeleton className="size-10 rounded-full" />
          <Skeleton className="size-10 rounded-full" />
          <Skeleton className="size-10 rounded-full" />
        </div>
        <div className="h-[400px] p-3 space-y-2">
          <Skeleton className="h-5 w-full rounded-full" />
          <Skeleton className="h-5 w-9/12 rounded-full" />
          <Skeleton className="h-5 w-10/12 rounded-full" />
        </div>
      </div>
    );
  return (
    <div className={cn("relative", disabled ? "opacity-50" : "")}>
      <div className="border rounded-lg">
        <div className="border-b p-1 flex items-center gap-1 flex-wrap">
          <BlockList editor={editor} />
          <GroupButtonAction editor={editor} />
          <MoreAction editor={editor} />
          <AddProductBtn editor={editor} />
        </div>
        <EditorContent
          className="[&>*]:outline-none [&>*]:whitespace-pre-wrap h-[400px] overflow-y-scroll p-3"
          editor={editor}
        />
      </div>
      {disabled && (
        <div className="absolute rounded-lg z-10 top-0 left-0  bottom-0 right-0" />
      )}
    </div>
  );
};

export default DisplayEditor;
