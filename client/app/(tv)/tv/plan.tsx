"use client";
import React from "react";
import TaskFilter from "./task-filter";
import { useplan } from "@/components/providers/plan-provider";
import { useSidebar } from "@/components/ui/sidebar";
import {
  FilterIcon,
  PanelLeftIcon,
  SlidersHorizontalIcon,
  XIcon,
} from "lucide-react";
import { Plan } from "@/schema/plan.schema";
import Task, { TaskProps } from "./task";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getTaskOfPlan } from "@/services/plan.service";
import { useTask } from "@/components/providers/task-provider";
import { cn } from "@/lib/utils";

const PlanContainer = (props: Plan) => {
  const { selected, removePlan } = useplan();
  const { toggleSidebar } = useSidebar();

  const queryClient = useQueryClient();

  const { socket, connected, socketJoinPlan } = useTask();

  function onCreateTask() {
    queryClient.invalidateQueries({ queryKey: ["plan", props.id] });
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
    queryKey: ["plan", props.id],
    queryFn: async () => {
      return await getTaskOfPlan(props.id);
    },
  });

  return (
    <div className="flex flex-col relative h-screen overflow-hidden">
      <div className="bg-white p-2 rounded-md">
        <div className="flex items-center gap-2 w-full">
          {selected.map((p) => p.id).indexOf(props.id) == 0 ? (
            <button type="button" onClick={toggleSidebar} className="p-2">
              <PanelLeftIcon className="size-6 shrink-0 text-muted-foreground" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => removePlan(props.id)}
              className="p-2"
            >
              <XIcon className="size-6 shrink-0 text-muted-foreground" />
            </button>
          )}

          <h4 className="text-lg font-semibold text-back line-clamp-2 w-full">
            {props.name}
          </h4>
          <div className="flex items-center gap-1">
            <button type="button" className="p-2">
              <FilterIcon className="size-6 shrink-0 text-muted-foreground" />
            </button>
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

      <main className="flex flex-col gap-2 p-1 h-full overflow-y-scroll">
        {planQuery.data && planQuery.data.length > 0 ? (
          planQuery.data.map((task, idx) => (
            <Task
              key={idx}
              title={task.title}
              subTitle={task.subTitle}
              tags={["Factory"]}
              dueDate={task.createdAt}
              startDate={task.createdAt}
              priority={task.priority}
              progress={task.progress}
              subTasks={task.subTasks}
            />
          ))
        ) : (
          <div className="text-center text-xl">Chưa có đơn hàng</div>
        )}
      </main>
    </div>
  );
};

export default PlanContainer;
