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
import { cn, fileToBase64 } from "@/lib/utils";
import { BoxesIcon, ImageIcon } from "lucide-react";
import IntInput from "@/components/int-input";

export type ProductNodeData = {
  id: string;
  name: string;
  src: string;
  amount: number;
  unit: "Thùng" | "Sản Phẩm";
  amountOfCargoBox: number;
};

const listProductData = [
  {
    id: "1",
    name: "Sản Phẩm A",
    src: "https://res.cloudinary.com/dr1ntj4ar/image/upload/v1733792755/ich/z6113933456466_e226585b670b0e7de7074471d135cc0a_fk2rtu.jpg",
    amountOfCargoBox: 200,
  },
  {
    id: "2",
    name: "Sản Phẩm B",
    src: "https://res.cloudinary.com/dr1ntj4ar/image/upload/v1733792756/ich/z6114016917424_fb687d45beb2bed71ca987e94c618893_offfni.jpg",
    amountOfCargoBox: 100,
  },
  {
    id: "3",
    name: "Sản Phẩm C",
    src: "https://res.cloudinary.com/dr1ntj4ar/image/upload/v1733792754/ich/z6100125014020_bb33a1f31eb02b5fb7dbdb5c02c35ff9_fj3lij.jpg",
    amountOfCargoBox: 0,
  },
  {
    id: "4",
    name: "Sản Phẩm D",
    src: "https://res.cloudinary.com/dr1ntj4ar/image/upload/v1733792753/ich/z6098129988173_773369cd8085d1852b6e652faf6e8940_fpdxaz.jpg",
    amountOfCargoBox: 500,
  },
];

const units = ["Thùng", "Sản Phẩm"];

export const AddProductBtn = ({ editor }: { editor: Editor }) => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [isSelected, setIsSelected] = React.useState<boolean>(false);
  const [data, setData] = React.useState<ProductNodeData>({
    id: "0",
    name: "",
    src: "",
    amount: 0,
    unit: "Sản Phẩm",
    amountOfCargoBox: 0,
  });

  editor.on("selectionUpdate", ({ editor }) => {
    if (editor.isActive("product")) {
      setIsSelected(true);
      const data = editor.getAttributes("product");
      setData({
        id: data.id,
        name: data.name,
        src: data.src,
        amount: parseInt(data.amount, 10),
        unit: data.unit,
        amountOfCargoBox: parseInt(data.amountOfCargoBox, 10),
      });
    } else {
      setIsSelected(false);
    }
  });

  React.useEffect(() => {
    if (open) {
      if (!isSelected) {
        setData({
          id: "0",
          name: "",
          src: "",
          amount: 0,
          unit: "Sản Phẩm",
          amountOfCargoBox: 0,
        });
      } else {
        const data = editor.getAttributes("product");
        setData({
          id: data.id,
          name: data.name,
          src: data.src,
          amount: parseInt(data.amount, 10),
          unit: data.unit,
          amountOfCargoBox: parseInt(data.amountOfCargoBox, 10),
        });
      }
    }
  }, [editor, isSelected, open]);

  const handleAddProduct = () => {
    editor.commands.addProduct(data);
    setOpen(false);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const data = await fileToBase64<string>(file);
    setData((prev) => ({
      ...prev,
      id: "",
      src: data,
      name: "",
      amount: 0,
      amountOfCargoBox: 0,
      unit: "Sản Phẩm",
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          size="icon"
          variant={isSelected ? "secondary" : "ghost"}
        >
          <BoxesIcon className="size-5 shrink-0" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-screen-sm">
        <DialogHeader>
          <DialogTitle>
            {isSelected ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm"}
          </DialogTitle>
          <DialogDescription>{isSelected ? "" : ""}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="url" className="text-right text-base font-medium">
              Hình
            </Label>
            <div className="col-span-3 flex gap-2">
              {data.src == "" ? (
                <div className="flex flex-col justify-center items-center text-center text-muted-foreground shrink-0 size-[150px] border-2 border-dashed rounded-md">
                  <ImageIcon className="shrink-0 size-10 mx-auto" />
                  <p className="text-xs mx-4">
                    Chọn hình hoặc tải hình ảnh không quá 5MB
                  </p>
                </div>
              ) : (
                <div className="relative aspect-square size-[150px] rounded-md overflow-hidden shrink-0">
                  <Image
                    src={data.src}
                    fill
                    alt="Product"
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              )}

              <div className="col-span-2 space-y-1 flex flex-col w-full h-[150px]">
                <Label htmlFor="url" className="text-base font-medium">
                  Danh sách sản phẩm:
                </Label>
                <ul className="h-full max-w-[272px] overflow-y-scroll pr-1 space-y-0.5">
                  {listProductData.map((product) => (
                    <li
                      key={product.id}
                      className={cn(
                        "p-1 rounded-md truncate",
                        product.id == data.id ? "bg-accent" : "hover:bg-accent"
                      )}
                      onClick={() => {
                        setData((prev) => ({
                          ...prev,
                          id: product.id,
                          src: product.src,
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
                <div className="flex items-center gap-1">
                  <label
                    htmlFor="upload"
                    className="basis-1/2 text-center h-6 rounded-md hover:bg-accent border cursor-pointer"
                  >
                    <p>Tải hình lên</p>
                    <input
                      id="upload"
                      onChange={handleUpload}
                      type="file"
                      className="hidden"
                      accept="image/png, image/gif, image/jpeg"
                    />
                  </label>
                  <button
                    disabled={data.src == ""}
                    type="button"
                    className="basis-1/2 h-6 rounded-md hover:bg-accent border disabled:opacity-50"
                    onClick={() => setData((prev) => ({ ...prev, src: "" }))}
                  >
                    Xoá hình
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right text-base font-medium">
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
              className="col-span-3 focus-visible:ring-offset-0 focus-visible:ring-0"
              placeholder="Tên sản phẩm"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="unit" className="text-right text-base font-medium">
              Đơn Vị Tính
            </Label>
            <div className="flex items-center col-span-3 border rounded-md p-1 gap-1">
              {units.map((unit) => (
                <button
                  onClick={() =>
                    setData((prev) => ({
                      ...prev,
                      unit: data.unit == "Sản Phẩm" ? "Thùng" : "Sản Phẩm",
                      amount: 0,
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
          <div className="grid grid-cols-4 items-center gap-4">
            <Label
              htmlFor="amount"
              className="text-right text-base font-medium"
            >
              Số lượng
            </Label>

            <div className="col-span-3 flex gap-3 items-center">
              <div
                className={cn(
                  "flex items-center",
                  data.unit == "Thùng" ? "gap-2 basis-4/6" : "w-full"
                )}
              >
                <IntInput
                  className="px-3 py-2 border rounded-md flex h-10 w-full"
                  value={data.amount.toString()}
                  onChange={(v) => {
                    let newV = v;
                    if (v == "" || isNaN(parseInt(v)) || parseInt(v) < 0) {
                      newV = "0";
                    }

                    setData((prev) => ({
                      ...prev,
                      amount: parseInt(newV),
                    }));
                  }}
                  placeholder="Thùng"
                />

                {data.unit == "Thùng" && (
                  <p className="flex shrink-0 text-sm">Thùng</p>
                )}
              </div>
              {data.unit == "Thùng" && (
                <>
                  <span className="font-bold basis-1/6 text-center text-lg">
                    x
                  </span>
                  <div className="flex items-center gap-2 basis-4/6">
                    <IntInput
                      className="px-3 py-2 border rounded-md flex h-10 w-full"
                      value={data.amountOfCargoBox.toString()}
                      onChange={(v) => {
                        let newV = v;
                        if (v == "" || isNaN(parseInt(v)) || parseInt(v) < 0) {
                          newV = "0";
                        }
                        setData((prev) => ({
                          ...prev,
                          amountOfCargoBox: parseInt(newV),
                        }));
                      }}
                      placeholder="Sản phẩm"
                    />

                    <p className="flex shrink-0 text-sm">Sản phẩm</p>
                  </div>
                </>
              )}
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
            onClick={handleAddProduct}
            disabled={data.name == "" || data.amount == 0}
          >
            {isSelected ? "Lưu" : "Thêm "}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export const ProductNodeView = ({ node }: NodeViewRendererProps) => {
  return (
    <NodeViewWrapper>
      <div className="flex gap-2 py-2">
        {node.attrs.src == "" ? (
          <div className="hidden sm:flex items-center border-2 border-dashed rounded-md shrink-0 size-[100px] text-center">
            <ImageIcon className="shrink-0 size-8 text-muted-foreground mx-auto" />
          </div>
        ) : (
          <div className="hidden sm:block relative aspect-square size-[100px] rounded-md overflow-hidden shrink-0">
            <Image
              src={node.attrs.src}
              fill
              alt="Product"
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}
        <div className="w-full p-1">
          <h1 className="text-4xl font-bold line-clamp-2 md:line-clamp-1">
            {node.attrs.name}
          </h1>
          <div className="flex items-center gap-1">
            <p className="p-1 text-md">
              <span>SL:</span>
              <span className="font-bold text-2xl">{` ${node.attrs.amount} ${node.attrs.unit}`}</span>
              {node.attrs.amountOfCargoBox > 0 && (
                <span className="text-sm">
                  {` x ${node.attrs.amountOfCargoBox} SP`}
                </span>
              )}
            </p>
          </div>
        </div>
      </div>
    </NodeViewWrapper>
  );
};
