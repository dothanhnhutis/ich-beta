"use client";
import React from "react";

const LoopVerticalScroll = () => {
  const ref1 = React.useRef<HTMLDivElement | null>(null);
  const [startY, setStartY] = React.useState(0); // Initial Y position on drag start
  const [currentTranslateY, setCurrentTranslateY] = React.useState(-100); // Current translateY value

  const handleMouseDown = (event: React.MouseEvent) => {
    // setStartY(event.clientY); // Store the initial Y position
    // document.addEventListener("mousemove", handleMouseMove);
    // document.addEventListener("mouseup", handleMouseUp);

    // console.log(event.clientY);
    setStartY(event.clientY);
  };

  React.useEffect(() => {
    const handleMouseUp = (event: MouseEvent) => {
      if (!ref1.current) return;
      const deltaY = event.clientY - startY;
      setCurrentTranslateY((prev) => prev + deltaY);

      setStartY(event.clientY);

      ref1.current.style.transform = `translate3d(0, ${
        currentTranslateY + deltaY
      }px, 0)`;
      console.log("handleMouseUp");
    };

    if (ref1.current) {
      ref1.current.addEventListener("mouseup", handleMouseUp);
    }

    return () => ref1.current?.removeEventListener("mouseup", handleMouseUp);
  }, [currentTranslateY, startY]);

  // const handleMouseMove = (event: MouseEvent) => {
  //   if (!ref1.current) return;
  //   const deltaY = event.clientY - startY; // Calculate how much the mouse moved
  //   setCurrentTranslateY((prev) => prev + deltaY); // Update the translateY value
  //   setStartY(event.clientY); // Reset the start Y to the current position

  //   ref1.current.style.transform = `translate3d(0, ${
  //     currentTranslateY + deltaY
  //   }px, 0)`;
  // };

  return (
    <div className="bg-gray-100">
      <div className="h-[56px] sticky top-0 left-0 w-full bg-white">header</div>
      <div className="flex w-full gap-2">
        <div className="basis-1/3 h-[calc(100vh_-_56px)] overflow-hidden">
          <div
            ref={ref1}
            className="flex flex-col gap-2 py-2"
            style={{ transform: `translate3d(0px, -100px, 0px);` }}
            onMouseDown={handleMouseDown}
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
