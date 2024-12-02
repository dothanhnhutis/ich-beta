"use client";
import { Editor } from "@/components/editor/editor";
import { defaultSchema } from "@/components/editor/schema";
import { Heading1Icon } from "lucide-react";
import React from "react";
// import Editor from "./editor";

const TiptapPage = () => {
  const editorRef = React.useRef<HTMLDivElement | null>(null);
  const editorViewRef = React.useRef<Editor | null>(null);

  React.useEffect(() => {
    if (!editorRef.current) return;

    editorViewRef.current = new Editor({
      container: editorRef.current,
      schema: defaultSchema,
      html: `<h1>This is an <strong>initial</strong> content!</h1>`,
    });

    return () => {
      if (editorViewRef.current) {
        editorViewRef.current.editorView.destroy();
        editorViewRef.current = null;
      }
    };
  }, []);

  return (
    <div className="p-2 border ">
      <div className="flex gap-2">
        <button
          className="p-2 rounded-md border"
          onClick={() => {
            console.log(editorViewRef.current?.getHTML());
          }}
        >
          <Heading1Icon className="shrink-0 size-6" />
        </button>
      </div>
      <div className="p-2 [&>*]:outline-none rounded" ref={editorRef} />
    </div>
  );
};

export default TiptapPage;
