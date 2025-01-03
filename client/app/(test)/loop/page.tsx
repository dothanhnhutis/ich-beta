"use client";
import React from "react";

const LoopVerticalScroll = () => {
  const ref1 = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const container = ref1.current;
    if (!container) return;

    const handleScroll = (e: Event) => {
      console.log(ref1.current?.scrollTop);
    };

    container.addEventListener("scroll", handleScroll);
    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="bg-gray-100">
      <div className="h-[56px] sticky top-0 left-0 w-full bg-white">header</div>
      <div className="flex w-full gap-2">
        <div
          ref={ref1}
          className="flex flex-col gap-2 py-2 basis-1/3 h-[calc(100vh_-_56px)] overflow-y-scroll"
        >
          <div
            className="h-[200px] bg-sky-200 rounded-md shadow-md text-center shrink-0"
            style={{ transform: `translate3d(0px, 0px, 0px)` }}
          >
            1
          </div>
          <div className="h-[400px] bg-sky-200 rounded-md shadow-md text-center shrink-0">
            4
          </div>
          <div className="h-[600px] bg-sky-200 rounded-md shadow-md text-center shrink-0">
            7
          </div>
          <div className="h-[200px] bg-sky-200 rounded-md shadow-md text-center shrink-0">
            10
          </div>
          <div className="h-[100px] bg-sky-200 rounded-md shadow-md text-center shrink-0">
            13
          </div>
          <div className="h-[100px] bg-sky-200 rounded-md shadow-md text-center shrink-0">
            16
          </div>
        </div>
        <div className="flex flex-col gap-2 py-2 basis-1/3 h-[calc(100vh_-_56px)] overflow-y-scroll">
          <div className="h-[200px] bg-sky-200 rounded-md shadow-md text-center shrink-0">
            1
          </div>
          <div className="h-[400px] bg-sky-200 rounded-md shadow-md text-center shrink-0">
            4
          </div>
          <div className="h-[600px] bg-sky-200 rounded-md shadow-md text-center shrink-0">
            7
          </div>
          <div className="h-[200px] bg-sky-200 rounded-md shadow-md text-center shrink-0">
            10
          </div>
          <div className="h-[100px] bg-sky-200 rounded-md shadow-md text-center shrink-0">
            13
          </div>
          <div className="h-[100px] bg-sky-200 rounded-md shadow-md text-center shrink-0">
            16
          </div>
        </div>
        <div className="flex flex-col gap-2 py-2 basis-1/3 h-[calc(100vh_-_56px)] overflow-y-scroll">
          <div className="h-[200px] bg-sky-200 rounded-md shadow-md text-center shrink-0">
            1
          </div>
          <div className="h-[400px] bg-sky-200 rounded-md shadow-md text-center shrink-0">
            4
          </div>
          <div className="h-[600px] bg-sky-200 rounded-md shadow-md text-center shrink-0">
            7
          </div>
          <div className="h-[200px] bg-sky-200 rounded-md shadow-md text-center shrink-0">
            10
          </div>
          <div className="h-[100px] bg-sky-200 rounded-md shadow-md text-center shrink-0">
            13
          </div>
          <div className="h-[100px] bg-sky-200 rounded-md shadow-md text-center shrink-0">
            16
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoopVerticalScroll;
