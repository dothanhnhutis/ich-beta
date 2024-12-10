import { NodeViewRendererProps, NodeViewWrapper } from "@tiptap/react";
import React from "react";
import Image from "next/image";

const ProductNodeView = ({ node }: NodeViewRendererProps) => {
  return (
    <NodeViewWrapper>
      <div className="flex gap-2 py-2">
        {node.attrs.url == "" ? (
          <div className="border-2 border-dashed rounded-md shrink-0 size-[150px]">
            <button>select</button>
          </div>
        ) : (
          <div className="relative aspect-square size-[200px] rounded-md overflow-hidden shrink-0">
            <Image src={node.attrs.url} fill alt="Product" />
          </div>
        )}
        <div className="w-full p-1">
          <h1 className="text-4xl font-bold line-clamp-4">{node.attrs.name}</h1>
          <div className="flex items-center gap-1">
            <p className="bg-slate-100 p-1 rounded-md shadow-md font-medium text-xl">
              Số lượng: <span className="font-bold">{node.attrs.amount}</span>{" "}
              {node.attrs.unit}
            </p>
          </div>
        </div>
      </div>
    </NodeViewWrapper>
  );
};

export default ProductNodeView;
