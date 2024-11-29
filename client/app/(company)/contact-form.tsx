"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2Icon } from "lucide-react";
import crypto from "crypto-js";

type CreateContact = {
  name: string;
  phone: string;
  requestId: string;
  productName: string;
  description: string;
  email?: string | undefined;
  isReaded?: boolean | undefined;
  contactTag?: "NORMAL" | "ARCHIVE" | "JUNK" | "TRASH" | undefined;
};

export const ContactForm = () => {
  const [form, setForm] = React.useState<CreateContact>(() => {
    const init: CreateContact = {
      requestId: "",
      name: "",
      phone: "",
      email: "",
      productName: "",
      description: "",
    };
    if (typeof window != "undefined") {
      let requestId = window.localStorage.getItem("requestId");
      if (!requestId) {
        requestId = crypto.MD5(new Date().toISOString()).toString();
        window.localStorage.setItem("requestId", requestId);
      }
      init.requestId = requestId;
    }
    return init;
  });

  const handleOnchange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const [isPending, startTransistion] = React.useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="name">Tên khách hàng</Label>
        <Input
          value={form.name}
          placeholder="Tên khách hàng"
          onChange={handleOnchange}
          type="text"
          name="name"
          id="name"
          className="focus-visible:ring-transparent"
        />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          value={form.email}
          placeholder="Email"
          onChange={handleOnchange}
          type="email"
          name="email"
          id="email"
          className="focus-visible:ring-transparent"
        />
      </div>
      <div>
        <Label htmlFor="phone">Số điện thoại</Label>
        <Input
          value={form.phone}
          placeholder="Số điện thoại"
          onChange={handleOnchange}
          name="phone"
          id="phone"
          className="focus-visible:ring-transparent"
        />
      </div>
      <div>
        <Label htmlFor="productName">Sản phẩm quan tâm</Label>
        <Input
          value={form.productName}
          placeholder="Sản phẩm quan tâm"
          onChange={handleOnchange}
          name="productName"
          id="productName"
          className="focus-visible:ring-transparent"
        />
      </div>
      <div className="col-span-2">
        <Label htmlFor="description">Nội dung</Label>
        <Textarea
          value={form.description}
          name="description"
          onChange={handleOnchange}
          id="description"
          className="focus-visible:ring-transparent h-[150px]"
          placeholder="Nội dung yêu cầu"
        />
      </div>
      <div className="col-span-2">
        <Button
          disabled={
            isPending ||
            form.name == "" ||
            form.phone == "" ||
            form.description == "" ||
            form.productName == "" ||
            form.requestId == ""
          }
          variant="default"
          className="w-full"
        >
          {isPending ? (
            <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            "Gửi yêu cầu"
          )}
        </Button>
      </div>
    </form>
  );
};
