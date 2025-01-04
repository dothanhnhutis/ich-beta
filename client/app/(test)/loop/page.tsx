"use client";
import React from "react";

const data = [
  {
    id: "1",
    height: 200,
  },
];

const FPS = 120;

const LoopItem = () => {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const listRef = React.useRef<HTMLDivElement | null>(null);
  const [listData, setListData] = React.useState<
    {
      id: string;
      height: number;
    }[]
  >(data);
  const firstChildRef = React.useRef<HTMLDivElement | null>(null);

  const [isOverContainer, setOverContainer] = React.useState<boolean>(false);
  const [currentTranslateY, setCurrentTranslateY] = React.useState<number>(0);

  React.useEffect(() => {
    if (!listRef.current || !containerRef.current) return;
    setOverContainer(
      containerRef.current.offsetHeight < listRef.current.offsetHeight
    );
  }, []);

  React.useEffect(() => {
    if (!isOverContainer) return;
    const time = setInterval(() => {
      if (!listRef.current || !containerRef.current) return;
      if (currentTranslateY + listRef.current.offsetHeight <= 0) {
        setCurrentTranslateY(containerRef.current.offsetHeight);
      } else {
        setCurrentTranslateY((prev) => prev - 1);
      }
    }, 1000 / FPS);
    return () => clearInterval(time);
  }, [currentTranslateY, isOverContainer]);

  React.useEffect(() => {
    if (!firstChildRef.current || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const item1Rect = firstChildRef.current.getBoundingClientRect();

    if (item1Rect.bottom <= containerRect.top) {
      setListData((prev) => {
        const firstChild = prev[0];
        const newList = prev.filter((d) => d.id != firstChild.id);
        return [...newList, firstChild];
      });
      setCurrentTranslateY(-1);
    }
  }, [currentTranslateY, listData]);

  return (
    <div
      ref={containerRef}
      className="basis-1/3 h-[calc(100vh_-_56px)] overflow-hidden"
    >
      <div
        ref={listRef}
        className="flex flex-col gap-2 py-2"
        style={{ transform: `translate3d(0px, ${currentTranslateY}px, 0px)` }}
      >
        {listData.map((d, idx) => (
          <div
            key={idx}
            ref={(el) => {
              if (idx == 0) {
                firstChildRef.current = el;
              }
            }}
            className={`h-[${d.height}px] bg-sky-200 rounded-md shadow-md text-center shrink-0`}
          >
            {d.id}
          </div>
        ))}
      </div>
    </div>
  );
};

const LoopVerticalScroll = () => {
  return (
    <div className="bg-gray-100">
      <div className="h-[56px] sticky top-0 left-0 w-full bg-white">header</div>
      <div className="flex w-full gap-2">
        <LoopItem />
        <LoopItem />
        <LoopItem />
      </div>
    </div>
  );
};

export default LoopVerticalScroll;
