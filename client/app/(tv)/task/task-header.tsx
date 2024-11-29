"use client";
import React from "react";

type TaskHeaderProps = {
  title: string;
  subTitle: string;
};

const TaskHeader = ({ title, subTitle }: TaskHeaderProps) => {
  return (
    <React.Fragment>
      <h4 className="font-semibold lg:text-lg xl:text-2xl lg:line-clamp-2 2xl:text-4xl">
        {title}
      </h4>
      <p className="text-sm lg:text-base xl:text-lg text-muted-foreground 2xl:text-lg">
        {subTitle}
      </p>
    </React.Fragment>
  );
};
export default TaskHeader;
