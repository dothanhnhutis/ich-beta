"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { LoaderPinwheelIcon } from "lucide-react";
import { changeEmailAction } from "../actions";

const ReplaceEmailForm = ({ disabled }: { disabled?: boolean }) => {
  const [optenDialog, setOptenDialog] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const formRef = React.useRef<HTMLFormElement>(null);

  const [state, formAction, isPending] = React.useActionState<
    { success: boolean | null; message: string },
    FormData
  >(changeEmailAction, {
    success: null,
    message: "",
  });
  console.log(state);

  React.useEffect(() => {
    setEmail("");
    formRef.current?.reset();
    if (state.success) {
      setOptenDialog(false);
      toast.success(state.message);
    }
  }, [state]);

  return (
    <Dialog open={optenDialog} onOpenChange={setOptenDialog}>
      <Button
        disabled={disabled}
        variant="link"
        onClick={() => {
          setOptenDialog(true);
        }}
      >
        <span>Không nhận được email?</span>
      </Button>
      <DialogContent className="sm:max-w-screen-md gap-0">
        <DialogHeader>
          <DialogTitle className="text-xl">Không nhận được email?</DialogTitle>
          <DialogDescription>
            Dưới đây là một số lời khuyên để giúp bạn tìm thấy nó.
          </DialogDescription>
        </DialogHeader>

        <ol className="[&>li]:mt-3 [&>li>span]:font-semibold">
          <li>
            <span>1. Gửi lại email</span>
          </li>
          <li>
            <span>2. Tìm kiếm email</span>
            <p className="text-muted-foreground text-sm">
              Chúng tôi sẽ gửi email từ &#39;ICH&#39;, để bạn có thể nhanh chóng
              tìm kiếm nó. Nếu nó không có trong hộp thư đến của bạn, hãy kiểm
              tra các thư mục của bạn. Nếu bộ lọc thư rác hoặc quy tắc email đã
              di chuyển email thì email đó có thể nằm trong thư mục Thư rác
              (Spam or Junk), Thùng rác (Trash), Mục đã xóa (Deleted Items) hoặc
              Lưu trữ (Archive folder).
            </p>
          </li>
          <li>
            <span>3. Làm cách nào để xác nhận email của tôi?</span>
            <p className="text-muted-foreground text-sm">
              Nếu bạn không thể nhấp vào liên kết, hãy sao chép URL đầy đủ từ
              email và dán vào cửa sổ trình duyệt web mới.
            </p>
          </li>
          <li>
            <span>4. Thay đổi email của bạn</span>
          </li>
        </ol>
        <form
          ref={formRef}
          action={formAction}
          className="flex flex-col sm:flex-row gap-2 mt-4"
        >
          <div>
            <Input
              name="email"
              disabled={isPending}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="text"
              placeholder="Email address"
              className={cn(
                "sm:max-w-[300px] focus-visible:ring-offset-0 focus-visible:ring-transparent",
                state.success == false && !isPending ? "border-destructive" : ""
              )}
            />
            {state.success == false && !isPending && (
              <p className="text-destructive font-light text-sm">
                {/* You have signed up for this email */}
                {state.message}
              </p>
            )}
          </div>

          <Button
            disabled={isPending}
            variant="outline"
            className="rounded-full border-2 border-primary !text-primary font-bold"
          >
            {isPending && (
              <LoaderPinwheelIcon className="h-4 w-4 animate-spin flex-shrink-0 mr-2" />
            )}
            Cập nhật và gửi
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReplaceEmailForm;
