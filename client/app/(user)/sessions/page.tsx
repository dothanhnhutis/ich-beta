import { getSessionsService } from "@/services/users.service";
import { cookies } from "next/headers";
import React from "react";
import SessionItem from "./session-item";
import { deleteSessionByIdAction } from "../actions";

const SessionsPage = async () => {
  const cookieStore = await cookies();

  const sessions = await getSessionsService({
    headers: {
      cookie: cookieStore
        .getAll()
        .map(({ name, value }) => `${name}=${encodeURIComponent(value)}`)
        .join("; "),
    },
  });

  return (
    <div className="mx-auto max-w-screen-lg w-full bg-white p-4">
      <div className="min-[300px]:flex-row w-full gap-4 border-b pb-4">
        <h3 className="text-3xl font-bold">Sessions</h3>
        <p className="text-xs font-normal leading-snug text-muted-foreground">
          This is a list of devices that have logged into your account. Revoke
          any sessions that you do not recognize.
        </p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-full gap-4 py-4 ">
        {sessions.map((session) => (
          <SessionItem
            key={session.id}
            session={session}
            action={deleteSessionByIdAction}
          />
        ))}
      </div>
    </div>
  );
};

export default SessionsPage;
