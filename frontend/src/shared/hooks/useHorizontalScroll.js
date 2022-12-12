import { useRef, useEffect, useState, useCallback } from "react";

let scrollValue;
export function useHorizontalScroll() {
  const [scrollPosition, setScrollPosition] = useState(); //left, middle or right
  const scrollRef = useRef();

  const scroll = useCallback((direction) => {
    const el = scrollRef.current;

    if (el) {
      scrollValue = direction === "right" ? el.scrollLeft + 200 : el.scrollLeft - 200;
      el.scrollTo({
        behavior: "smooth",
        left: scrollValue,
      });
    }
  }, []);

  const changeScrollPosition = useCallback((el) => {
    // if scrollvalue ===null it will take previous value during wheel scroll,
    if (el.scrollLeft === 0 || (scrollValue !== null && scrollValue <= 0)) return setScrollPosition("left");
    if (el.scrollLeft === el.scrollLeftMax || (scrollValue !== null && scrollValue >= el.scrollLeftMax)) return setScrollPosition("right");
    return setScrollPosition("middle");
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    // Set scroll arrows at page refresh
    el && changeScrollPosition(el);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      const onScroll = (e) => {
        changeScrollPosition(el);
      };
      el.addEventListener("scroll", onScroll);
      return () => el.removeEventListener("scroll", onScroll);
    }
  }, []);

  useEffect(() => {
    const el = scrollRef.current;

    if (el) {
      const onWheel = () => {
        scrollValue = null;
      };
      el.addEventListener("wheel", onWheel);
      return () => el.removeEventListener("wheel", onWheel);
    }
  }, []);

  return { scrollRef, scrollPosition, scroll };
}
