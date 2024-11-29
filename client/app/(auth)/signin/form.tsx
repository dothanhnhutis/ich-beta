"use client";
import ContinueBtn from "@/components/continue-btn";
import PasswordInput from "@/components/password-input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { mainFetch } from "@/lib/custom-fetch";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import {
  SignIn,
  SignInMFA,
  signInSchema,
  signInWithMFASchema,
} from "@/schema/auth.schema";
import { signIn } from "@/services/auth.service";
import { useMutation } from "@tanstack/react-query";
import { LoaderCircleIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

type SignInFormProps = {
  email?: string;
};

export const SignInForm = ({ email }: SignInFormProps) => {
  const router = useRouter();

  const [signInformData, setSignInFormData] = React.useState<SignIn>({
    email: email || "",
    password: "",
  });

  const [signInMFAformData, setSignInMFAFormData] = React.useState<SignInMFA>({
    code: "",
    isBackupCode: false,
    sessionId: "",
  });

  const signinMutation = useMutation({
    mutationFn: async (input: SignIn) => {
      return await signIn(input);
    },
    onSuccess({ session }) {
      if (session) {
        setSignInMFAFormData((prev) => ({
          ...prev,
          sessionId: session.sessionId,
        }));
      } else {
        router.push(DEFAULT_LOGIN_REDIRECT);
        router.refresh();
      }
    },
    onSettled() {
      setSignInFormData({
        email: "",
        password: "",
      });
    },
  });

  const signinMFAMutation = useMutation({
    mutationFn: async (input: SignInMFA) => {
      return await mainFetch.post<{ message: string }>(
        "/auth/signin/mfa",
        input
      );
    },
    onMutate() {
      setSignInMFAFormData((prev) => ({
        ...prev,
        code: "",
      }));
    },
    onSuccess({ data: { message } }) {
      toast.success(message);
    },
    onError(error) {
      console.log(error.message);
    },
  });

  const handleSignInOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignInFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSignInSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const parse = signInSchema.safeParse(signInformData);
    if (!parse.success) return;
    signinMutation.mutate(signInformData);
  };

  const handleCancel = () => {
    setSignInMFAFormData({
      code: "",
      isBackupCode: false,
      sessionId: "",
    });
    signinMutation.reset();
    signinMFAMutation.reset();
  };

  const handleSiginMFASubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const parse = signInWithMFASchema.safeParse(signInMFAformData);
    if (!parse.success) return;
    signinMFAMutation.mutate(signInMFAformData);
  };

  return (
    <main className="sm:p-8">
      {signInMFAformData.sessionId == "" ? (
        <form
          onSubmit={handleSignInSubmit}
          className="rounded-lg sm:border bg-card text-card-foreground sm:shadow-sm p-4 sm:p-6 sm:mx-auto sm:max-w-md transition-all"
        >
          <div className="flex flex-col space-y-1.5">
            <h3 className="font-semibold tracking-tight text-2xl">Đăng Nhập</h3>
            <p className="text-sm text-muted-foreground">
              Nhập email và mật khẩu để đăng nhập vào tài khoản của bạn
            </p>
          </div>

          <div className="pt-6">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  placeholder="test@example.com"
                  value={signInformData.email}
                  onChange={handleSignInOnChange}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Mật khẩu</Label>
                  {/* <Link
                    prefetch
                    href={`/recover${
                      signInformData.email == ""
                        ? ""
                        : "?email=" + signInformData.email
                    }`}
                    className="ml-auto inline-block text-sm underline "
                  >
                    Bạn quên mật khẩu?
                  </Link> */}
                </div>
                <PasswordInput
                  id="password"
                  name="password"
                  placeholder="********"
                  autoComplete="off"
                  value={signInformData.password}
                  onChange={handleSignInOnChange}
                />
                {signinMutation.isError && (
                  <p className="text-red-500 text-xs font-bold">
                    Email và mật khẩu không hợp lệ
                  </p>
                )}
              </div>

              <Button variant="default" disabled={signinMutation.isPending}>
                {signinMutation.isPending && (
                  <LoaderCircleIcon className="h-4 w-4 animate-spin flex-shrink-0 mr-1" />
                )}
                Đăng nhập
              </Button>
              {/* <ContinueBtn label="Đăng nhập với Google" redir="/login" /> */}
            </div>
            {/* <div className="mt-4 text-center text-sm">
              Bạn chưa có tài khoản?{" "}
              <Link prefetch className="underline" href="/signup">
                Đăng ký
              </Link>
            </div> */}
          </div>
        </form>
      ) : (
        <form
          onSubmit={handleSiginMFASubmit}
          className="rounded-lg sm:border bg-card text-card-foreground sm:shadow-sm p-4 sm:p-6 sm:mx-auto sm:max-w-md transition-all"
        >
          <div className="flex flex-col space-y-1.5">
            <h3 className="font-semibold tracking-tight text-2xl">
              Xác thực đa yếu tố (MFA)
            </h3>
            <p className="text-sm text-muted-foreground">
              Tài khoản của bạn được bảo mật bằng xác thực đa yếu tố (MFA). Để
              hoàn tất đăng nhập, hãy bật hoặc xem thiết bị MFA của bạn và nhập
              mã xác thực bên dưới.
            </p>
          </div>
          <div className="pt-6">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="mfa_code">Mã xác thực</Label>
                  <Link
                    href={"#"}
                    className="ml-auto inline-block text-sm underline "
                  >
                    Khắc phục sự cố MFA
                  </Link>
                </div>
                <Input
                  id="mfa_code"
                  name="mfa_code"
                  placeholder="MFA code"
                  maxLength={6}
                  value={signInMFAformData.code}
                  onChange={(e) => {
                    setSignInMFAFormData((prev) => ({
                      ...prev,
                      code: e.target.value,
                    }));
                  }}
                />
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="use_backup_code"
                    checked={signInMFAformData.isBackupCode}
                    onCheckedChange={(checked) =>
                      setSignInMFAFormData((prev) => ({
                        ...prev,
                        isBackupCode:
                          checked == "indeterminate" ? false : checked,
                      }))
                    }
                  />
                  <label
                    htmlFor="use_backup_code"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Sử dụng mã dự phòng
                  </label>
                </div>

                {signinMFAMutation.isError && (
                  <p className="text-red-500 text-xs font-bold">
                    {signinMFAMutation.error.message}
                  </p>
                )}
              </div>

              <Button variant="default" disabled={signinMFAMutation.isPending}>
                {signinMFAMutation.isPending && (
                  <LoaderCircleIcon className="h-4 w-4 animate-spin flex-shrink-0 mr-1" />
                )}
                Xác thực
              </Button>
              <Button
                variant={"outline"}
                onClick={handleCancel}
                disabled={signinMFAMutation.isPending}
              >
                Hủy bỏ
              </Button>
            </div>
          </div>
        </form>
      )}
      {false && (
        <form className="rounded-lg sm:border bg-card text-card-foreground sm:shadow-sm p-4 sm:p-6 sm:mx-auto sm:max-w-md transition-all">
          <div className="flex flex-col space-y-1.5">
            <h3 className="font-semibold tracking-tight text-2xl">
              Khắc phục sự cố xác thực thiết bị của bạn
            </h3>
          </div>
          xác thực bằng mã dự phòng hoặc gửi mã dự phòng qua Email
          <div className="pt-6">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="mfa_code">Mã xác thực</Label>
                </div>
                <Input
                  id="mfa_code"
                  name="mfa_code"
                  placeholder="MFA code"
                  maxLength={6}
                  value={signInMFAformData.code}
                  onChange={(e) => {
                    setSignInMFAFormData((prev) => ({
                      ...prev,
                      code: e.target.value,
                    }));
                  }}
                />
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="use_backup_code"
                    checked={signInMFAformData.isBackupCode}
                    onCheckedChange={(checked) =>
                      setSignInMFAFormData((prev) => ({
                        ...prev,
                        isBackupCode:
                          checked == "indeterminate" ? false : checked,
                      }))
                    }
                  />
                  <label
                    htmlFor="use_backup_code"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Sử dụng mã dự phòng
                  </label>
                </div>

                <p className="text-red-500 text-xs font-bold">message</p>
              </div>

              <Button variant="default">
                <LoaderCircleIcon className="h-4 w-4 animate-spin flex-shrink-0 mr-1" />
                Xác thực
              </Button>
              <Button
                variant={"outline"}
                onClick={handleCancel}
                disabled={signinMFAMutation.isPending}
              >
                Hủy bỏ
              </Button>
            </div>
          </div>
        </form>
      )}
    </main>
  );
};
