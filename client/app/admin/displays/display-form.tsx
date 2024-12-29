"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { Department } from "@/schema/department.schema";
import { Display } from "@/schema/display.schema";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LoaderCircleIcon, XIcon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import DisplayEditor from "@/components/tiptap/display-editor";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { createDisplayAction, updateDisplayAction } from "./actions";
import IntInput from "@/components/int-input";
const SelectDepartment = ({
  departments = [],
  selectedDefault,
  onSave,
  disabled,
}: {
  departments: Department[];
  selectedDefault: string[];
  onSave?: (departmentIds: string[]) => void;
  disabled?: boolean;
}) => {
  const [currentData, setCurrentData] =
    React.useState<string[]>(selectedDefault);

  const handleSave = () => {
    if (onSave) onSave(currentData);
  };

  return (
    <AlertDialog
      onOpenChange={(open) => {
        if (open) setCurrentData(selectedDefault);
      }}
    >
      <AlertDialogTrigger asChild>
        <button
          disabled={disabled}
          type="button"
          className="inline-flex px-2 py-1 gap-1 rounded-full border disabled:opacity-50"
        >
          <p className="text-sm">Chọn</p>
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hiển thị tại đâu ?</AlertDialogTitle>
          <AlertDialogDescription>
            Chọn phòng ban để hiển thị
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-2">
          <div className="grid gap-2 overflow-y-scroll border px-2 py-1 rounded-lg max-h-[162px]">
            {departments.map((d) => (
              <div
                key={d.id}
                className="flex items-center gap-2 hover:bg-muted p-1 rounded-md cursor-pointer"
                onClick={() => {
                  setCurrentData((prev) =>
                    prev.includes(d.id)
                      ? prev.filter((id) => id != d.id)
                      : [...prev, d.id]
                  );
                }}
              >
                <Checkbox checked={currentData.includes(d.id)} />
                <p className="line-clamp-1">{d.name}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-end items-center gap-2">
            <button
              type="button"
              className="text-primary text-sm hover:underline"
              onClick={() => setCurrentData([])}
            >
              Bỏ chọn tất cả
            </button>
            <button
              type="button"
              className="text-primary text-sm hover:underline"
              onClick={() => setCurrentData(selectedDefault)}
            >
              Đặt lại
            </button>
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Huỷ</AlertDialogCancel>
          <AlertDialogAction onClick={handleSave}>Lưu</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

type DisplayFormProps =
  | {
      departments: Department[];
      action: typeof createDisplayAction;
    }
  | {
      departments: Department[];
      display: Display;
      action: typeof updateDisplayAction;
    };

type DisplayFormData = {
  priority: number;
  content: string;
  enable: boolean;
  departmentIds: string[];
};

const DisplayForm = ({ departments = [], ...props }: DisplayFormProps) => {
  const [formData, setFormData] = React.useState<DisplayFormData>(() => {
    if ("display" in props) {
      return {
        priority: props.display.priority,
        enable: props.display.enable,
        content: props.display.content,
        departmentIds: props.display.departments.map((d) => d.id),
      };
    }
    return {
      priority: 0,
      enable: true,
      content: "<p></p>",
      departmentIds: [],
    };
  });

  const bindAction =
    "display" in props
      ? props.action.bind(null, props.display.id, formData)
      : props.action.bind(null, formData);

  const [state, formAction, isPending] = React.useActionState<{
    success: boolean | null;
    message: string;
  }>(bindAction, {
    success: null,
    message: "",
  });

  const router = useRouter();

  React.useEffect(() => {
    if (state.success != null) {
      if (state.success) {
        toast.success(state.message);
        router.back();
      } else {
        toast.error(state.message);
      }
    }
  }, [router, state]);

  return (
    <form action={formAction} className="grid sm:grid-cols-2 gap-4 mt-5">
      <div
        className={cn(
          "space-y-2 sm:col-span-1",
          formData.enable ? "sm:row-span-2" : ""
        )}
      >
        <label htmlFor="priority">Hiển thị tại</label>
        <div className="flex gap-2 items-center flex-wrap">
          {formData.departmentIds.map((departmentId) => {
            const department = departments.find(
              (department) => department.id == departmentId
            );
            if (!department) return;
            return (
              <div
                key={department.id}
                className="inline-flex px-2 py-1 gap-1 rounded-full border"
              >
                <p className="text-sm">{department.name}</p>
                <button
                  disabled={isPending}
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      departmentIds: prev.departmentIds.filter(
                        (i) => i != department.id
                      ),
                    }))
                  }
                >
                  <XIcon className="shrink-0 size-4" />
                </button>
              </div>
            );
          })}
          <SelectDepartment
            disabled={isPending}
            departments={departments}
            selectedDefault={formData.departmentIds}
            onSave={(data) => {
              setFormData((prev) => ({
                ...prev,
                departmentIds: data,
              }));
            }}
          />
        </div>
      </div>
      <div className="space-y-2">
        <label htmlFor="priority">Hiển thị</label>
        <div className="text-xs flex items-center gap-2 text-muted-foreground">
          <p className="w-full">Bật / Tắt hiển thị</p>
          <Switch
            disabled={isPending}
            className="block"
            checked={formData.enable}
            onCheckedChange={(v) =>
              setFormData((prev) => ({
                ...prev,
                enable: v,
                priority: 0,
              }))
            }
          />
        </div>
      </div>
      {formData.enable && (
        <div className="space-y-2">
          <label htmlFor="priority">Mức độ ưu tiên</label>
          <div className="text-xs flex items-center gap-2 text-muted-foreground">
            <p className="w-full">
              Mức độ ưu tiên cao thì sẽ được đẩy lên trên [0-99]
            </p>

            <IntInput
              disabled={isPending}
              className="w-16 border px-3 py-2 rounded-md text-black block"
              value={formData.priority.toString()}
              onChange={(v) => {
                let newV = v;
                if (v == "" || parseInt(v) < 0) {
                  newV = "0";
                }
                if (parseInt(v) > 99) {
                  newV = "99";
                }

                setFormData((prev) => ({
                  ...prev,
                  priority: parseInt(newV),
                }));
              }}
            />
          </div>
        </div>
      )}

      <div className="space-y-2 sm:col-span-2">
        <label htmlFor="priority">Nội dung</label>
        <DisplayEditor
          content={formData.content}
          onEditorChange={(e) => {
            console.log(e.getHTML());
            setFormData((prev) => ({
              ...prev,
              content: e.getHTML(),
            }));
          }}
          disabled={isPending}
        />
      </div>
      <div className="flex gap-2 justify-end items-center sm:col-span-2">
        <Button
          type="button"
          variant="outline"
          disabled={isPending}
          onClick={() => router.back()}
        >
          Huỷ
        </Button>

        <Button disabled={isPending}>
          {isPending && (
            <LoaderCircleIcon className="h-4 w-4 animate-spin flex-shrink-0 mr-1" />
          )}
          {"display" in props ? "Lưu lại" : "Tạo"}
        </Button>
      </div>
    </form>
  );
};

export default DisplayForm;
