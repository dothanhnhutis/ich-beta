"use client";
import React from "react";
import TaskFilter from "./task-filter";
import { useDepartment } from "@/components/providers/plan-provider";
import { useSidebar } from "@/components/ui/sidebar";
import {
  FilterIcon,
  PanelLeftIcon,
  PlusIcon,
  SlidersHorizontalIcon,
  XIcon,
} from "lucide-react";
import { Department } from "@/schema/department.schema";
import Task, { TaskProps } from "./task";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Display,
  getDisplaysOfDepartment,
} from "@/services/department.service";
import { useTask } from "@/components/providers/task-provider";
import { cn } from "@/lib/utils";

import CreateTaskModal from "./createTaskModal";
import { EditorContent, useEditor } from "@tiptap/react";
import { extensions } from "./tiptap/page";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";

const DisplayContainer = ({
  content,
  createdAt,
  updatedAt,
  priority,
}: Display) => {
  const editor = useEditor({
    editable: false,
    immediatelyRender: false,
    extensions,
    content,
  });

  return (
    <div className="animation-border p-2 border bg-white rounded-[10px]">
      <EditorContent editor={editor} />
      <div className="flex justify-end gap-4 items-center">
        <p className="text-xs text-muted-foreground">
          {`Priority: ${priority}`}
        </p>
        <p className="text-xs text-muted-foreground">
          {`CreateAt: ${format(createdAt, "dd/MM/yy HH:mm")}`}
        </p>
        <p className="text-xs text-muted-foreground">
          {`UpdatedAt: ${format(updatedAt, "dd/MM/yy HH:mm")}`}
        </p>
      </div>
    </div>
  );
};

const PlanContainer = (props: Department) => {
  const { selected, removeDepartment } = useDepartment();
  const { toggleSidebar } = useSidebar();

  const queryClient = useQueryClient();

  const { socket, connected, socketJoinPlan } = useTask();
  const audio = new Audio("/mp3/bell.mp3");

  function onCreateTask() {
    console.log("onCreateTask");
    audio.play();
    // queryClient.invalidateQueries({ queryKey: ["displays", props.id] });
  }

  React.useEffect(() => {
    socketJoinPlan(props.id);
  }, [socketJoinPlan, props.id]);

  React.useEffect(() => {
    if (socket) {
      socket.on("createTask", onCreateTask);
      socket.on("emptyTask", onCreateTask);
    }

    return () => {
      if (socket) {
        socket.off("createTask", onCreateTask);
        socket.off("emptyTask", onCreateTask);
      }
    };
  }, [socket]);

  const planQuery = useQuery({
    queryKey: ["displays", props.id],
    queryFn: async () => {
      return await getDisplaysOfDepartment(props.id);
    },
  });

  return (
    <div className="flex flex-col relative h-screen overflow-hidden ">
      <div className="bg-white p-2 rounded-md">
        <div className="flex items-center gap-2 w-full ">
          {selected.map((p) => p.id).indexOf(props.id) == 0 ? (
            <button type="button" onClick={toggleSidebar} className="p-2">
              <PanelLeftIcon className="size-6 shrink-0 text-muted-foreground" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => removeDepartment(props.id)}
              className="p-2"
            >
              <XIcon className="size-6 shrink-0 text-muted-foreground" />
            </button>
          )}

          <h4 className="text-lg font-semibold text-back line-clamp-2 w-full">
            {props.name}
          </h4>
          <div className="flex items-center gap-1">
            {/* <button type="button" className="p-2">
              <FilterIcon className="size-6 shrink-0 text-muted-foreground" />
            </button> */}
            <CreateTaskModal planId={props.id} title={props.name} />

            <div
              className={cn(
                "size-2 rounded-full shrink-0",
                connected ? "bg-green-300" : "bg-red-300"
              )}
            />
          </div>
        </div>
        {/* <TaskFilter /> */}
      </div>

      <ScrollArea className="h-full">
        <main className="flex flex-col gap-1 p-1 h-full relative z-0">
          {planQuery.data ? (
            planQuery.data.map((display) => (
              <DisplayContainer key={display.id} {...display} />
            ))
          ) : (
            <p>error</p>
          )}
        </main>
      </ScrollArea>
    </div>
  );
};

export default PlanContainer;
