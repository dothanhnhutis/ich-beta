"use client";
import React from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { UserSession } from "@/schema/user.schema";
import { z } from "zod";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { EllipsisIcon } from "lucide-react";
import { deleteSessionByIdAction } from "../actions";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const ipSchema = z.string().ip({ version: "v4" });
const SessionItem = ({
  session,
  action,
}: {
  session: UserSession;
  action: typeof deleteSessionByIdAction;
}) => {
  const { currentSession } = useAuth();
  const bindAction = action.bind(null, session.id);

  const [state, formAction, isPending] = React.useActionState<{
    success: boolean | null;
    message: string;
  }>(bindAction, {
    success: null,
    message: "",
  });

  React.useEffect(() => {
    if (state.success != null) {
      if (state.success) {
        toast.success(state.message);
      } else {
        toast.error(state.message);
      }
    }
  }, [state]);

  return (
    <form
      action={formAction}
      key={session.id}
      className={cn(
        "flex flex-col min-[400px]:flex-row sm:grid gap-2 border-b sm:border p-2 sm:rounded-2xl relative",
        isPending ? "animate-pulse" : ""
      )}
    >
      <div className="text-sm w-full relative">
        <p>
          {`IP: ${
            ipSchema.safeParse(session.reqInfo.ip).success
              ? session.reqInfo.ip
              : "unknown"
          }`}
        </p>
        <p>{`Device: ${
          session.reqInfo.userAgent.browser["name"] || "unknown"
        } on ${
          session.reqInfo.userAgent.device["model"] ||
          session.reqInfo.userAgent.device["type"] ||
          "unknown"
        }`}</p>

        <p>
          {`Last accessed: ${format(
            session.reqInfo.lastAccess,
            "dd/MM/yy HH:mm"
          )}`}
        </p>
        <p>
          {`Signed in: ${format(session.reqInfo.createAt, "dd/MM/yy HH:mm")}`}
        </p>

        <button type="button" className="sm:absolute top-0 right-0 static">
          <EllipsisIcon className="shrink-0 size-6" />
        </button>
      </div>
      <Separator className="hidden sm:block" />
      {currentSession && currentSession.id == session.id ? (
        <div className="flex items-center justify-center text-sm text-center text-nowrap align-middle h-10">
          <p>Current Session</p>
        </div>
      ) : (
        <Button disabled={isPending} variant="ghost">
          Revoke
        </Button>
      )}
    </form>
  );
};

export default SessionItem;
