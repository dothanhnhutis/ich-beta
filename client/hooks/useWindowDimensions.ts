"use client";
import { useState, useEffect } from "react";

const getWindowDeimensions = () => {
  if (typeof window !== "undefined") {
    const { innerWidth: width, innerHeight: height } = window;
    return { width, height };
  } else {
    return;
  }
};

export const useWindowDimensions = () => {
  const [windowDimensions, setWindowDimensions] = useState<
    ReturnType<typeof getWindowDeimensions>
  >(getWindowDeimensions());

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions(getWindowDeimensions());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [windowDimensions]);
  return windowDimensions;
};
