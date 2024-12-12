import React from "react";
import Image from "next/image";
import { Editor, NodeViewRendererProps, NodeViewWrapper } from "@tiptap/react";
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
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ProductNodeData } from "../page";

const listProductData = [
  {
    id: "1",
    name: "Sản Phẩm A",
    url: "https://res.cloudinary.com/dr1ntj4ar/image/upload/v1733792755/ich/z6113933456466_e226585b670b0e7de7074471d135cc0a_fk2rtu.jpg",
    amountOfCargoBox: 200,
  },
  {
    id: "2",
    name: "Sản Phẩm B",
    url: "https://res.cloudinary.com/dr1ntj4ar/image/upload/v1733792755/ich/z6113933456466_e226585b670b0e7de7074471d135cc0a_fk2rtu.jpg",
    amountOfCargoBox: 100,
  },
  {
    id: "3",
    name: "Sản Phẩm C",
    url: "https://res.cloudinary.com/dr1ntj4ar/image/upload/v1733792755/ich/z6113933456466_e226585b670b0e7de7074471d135cc0a_fk2rtu.jpg",
    amountOfCargoBox: 0,
  },
  {
    id: "4",
    name: "Sản Phẩm D",
    url: "https://res.cloudinary.com/dr1ntj4ar/image/upload/v1733792755/ich/z6113933456466_e226585b670b0e7de7074471d135cc0a_fk2rtu.jpg",
    amountOfCargoBox: 500,
  },
];

const units = ["Thùng", "Sản Phẩm"];

export const AddProductBtn = ({ editor }: { editor: Editor }) => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [data, setData] = React.useState<ProductNodeData>({
    id: "0",
    name: "",
    url: "",
    amount: 0,
    unit: "Sản Phẩm",
    amountOfCargoBox: 0,
  });

  // editor.on("selectionUpdate", ({ editor, transaction }) => {
  //   console.log("selectionUpdate");
  // });

  React.useEffect(() => {
    if (open) {
      setData({
        id: "0",
        name: "",
        url: "",
        amount: 0,
        unit: "Sản Phẩm",
        amountOfCargoBox: 0,
      });
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    editor.commands.addProduct(data);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Sản Phẩm</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-screen-sm">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Sản Phẩm</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="url" className="text-right text-base font-medium">
                Hình
              </Label>
              <div className="col-span-3 flex gap-2">
                {data.url == "" ? (
                  <div className="shrink-0 size-[150px] border-2 border-dashed rounded-md"></div>
                ) : (
                  <div className="relative aspect-square size-[150px] rounded-md overflow-hidden shrink-0">
                    <Image src={data.url} fill alt="Product" />
                  </div>
                )}

                <div className="col-span-2 space-y-1 flex flex-col w-full h-[150px]">
                  <Label htmlFor="url" className="text-base font-medium">
                    Danh sách sản phẩm:
                  </Label>
                  <ul className="h-full overflow-y-scroll pr-1 space-y-0.5">
                    {listProductData.map((product) => (
                      <li
                        key={product.id}
                        className={cn(
                          "p-1 rounded-md",
                          product.id == data.id
                            ? "bg-accent"
                            : "hover:bg-accent"
                        )}
                        onClick={() => {
                          setData((prev) => ({
                            ...prev,
                            id: product.id,
                            url: product.url,
                            name: product.name,
                            unit:
                              product.amountOfCargoBox == 0
                                ? "Sản Phẩm"
                                : "Thùng",
                            amountOfCargoBox: product.amountOfCargoBox,
                          }));
                        }}
                      >
                        <span>{product.name}</span>
                      </li>
                    ))}
                  </ul>
                  <label
                    htmlFor="upload"
                    className="w-full text-center h-6 rounded-md hover:bg-accent border cursor-pointer"
                    // onClick={() =>
                    //   setData((prev) => ({
                    //     ...prev,
                    //     id: "",
                    //     url: "",
                    //     name: "",
                    //     amount: 0,
                    //     amountOfCargoBox: 0,
                    //     unit: "Sản Phẩm",
                    //   }))
                    // }
                  >
                    <p>Tải lên</p>
                    <input id="upload" type="file" className="hidden" />
                  </label>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label
                htmlFor="name"
                className="text-right text-base font-medium"
              >
                Tên sản phẩm
              </Label>
              <Input
                id="name"
                value={data.name}
                onChange={(e) => {
                  setData((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }));
                }}
                className="col-span-3"
                placeholder="Tên sản phẩm"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label
                htmlFor="amount"
                className="text-right text-base font-medium"
              >
                Số lượng
              </Label>
              <Input
                id="amount"
                className={cn(
                  data.unit == "Thùng" && data.amountOfCargoBox > 0
                    ? "col-span-1"
                    : "col-span-3"
                )}
                value={data.amount}
                onChange={(e) => {
                  setData((prev) => ({
                    ...prev,
                    amount: parseInt(e.target.value),
                  }));
                }}
              />
              {data.unit == "Thùng" && data.amountOfCargoBox > 0 && (
                <p className={cn("col-span-2")}>
                  x <span className="font-bold">{data.amountOfCargoBox}</span>{" "}
                  Sản phẩm
                </p>
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label
                htmlFor="unit"
                className="text-right text-base font-medium"
              >
                Đơn Vị Tính
              </Label>
              <div className="flex items-center col-span-3 border rounded-md p-1 gap-1">
                {units.map((unit) => (
                  <button
                    onClick={() =>
                      setData((prev) => ({
                        ...prev,
                        unit: data.unit == "Sản Phẩm" ? "Thùng" : "Sản Phẩm",
                        amountOfCargoBox:
                          unit == "Sản Phẩm"
                            ? 0
                            : listProductData.find((list) => list.id == prev.id)
                                ?.amountOfCargoBox || 0,
                      }))
                    }
                    key={unit}
                    type="button"
                    className={cn(
                      "basis-1/2 rounded-md",
                      unit == data.unit ? "bg-accent" : "bg-transparent"
                    )}
                  >
                    {unit}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Huỷ
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={data.url == "" || data.name == "" || data.amount == 0}
            >
              Thêm
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export const ProductNodeView = ({ node }: NodeViewRendererProps) => {
  return (
    <NodeViewWrapper>
      <div className="flex gap-2 py-2">
        {node.attrs.url == "" ? (
          <div className="border-2 border-dashed rounded-md shrink-0 size-[100px]">
            <button>select</button>
          </div>
        ) : (
          <div className="relative aspect-square size-[100px] rounded-md overflow-hidden shrink-0">
            <Image src={node.attrs.url} fill alt="Product" />
          </div>
        )}
        <div className="w-full p-1">
          <h1 className="text-xl font-bold line-clamp-2">{node.attrs.name}</h1>
          <div className="flex items-center gap-1">
            <p className="p-1 font-medium text-xl">
              SL: <span className="font-bold">{node.attrs.amount}</span>{" "}
              {node.attrs.unit}
              <span> x {node.attrs.amountOfCargoBox} Sản phẩm</span>
            </p>
          </div>
        </div>
      </div>
    </NodeViewWrapper>
  );
};
