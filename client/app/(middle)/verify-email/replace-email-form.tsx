"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { z } from "zod";
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
import { useAuth } from "@/components/providers/auth-provider";

const ReplaceEmailForm = ({ disabled }: { disabled?: boolean }) => {
  const [optenDialog, setOptenDialog] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const {  currentUser,changeEmail } = useAuth();
  const [isPending, startTransition] = React.useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (currentUser?.email == email) {
      setEmail("");
      setOptenDialog(false);
      return;
    }
    if (!z.string().email().safeParse(email).success) return;

    try {
      setError(false);
      startTransition(async () => {
        await changeEmail(email);
      });
      setEmail("");
      toast.success("Updated and resending e-mail...");
      setOptenDialog(false);
    } catch (error: unknown) {
      setError(true);
      console.log(error);
    }
  };

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
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-2 mt-4"
        >
          <div className="">
            <Input
              disabled={isPending}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="text"
              placeholder="Email address"
              className={cn(
                "sm:max-w-[300px] focus-visible:ring-offset-0 focus-visible:ring-transparent",
                error ? "border-destructive" : ""
              )}
            />
            {error && (
              <p className="text-destructive font-light text-sm">
                You have signed up for this email
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
