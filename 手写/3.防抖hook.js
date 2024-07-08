import { useCallback, useEffect, useRef, useRef } from "react";

export default function useDebounce(fn, delay = 1000, dep = []) {
  const { current } = useRef({
    fn,
    timer: null,
  });

  useEffect(
    function () {
      current.fn = fn;
    },
    [fn]
  );

  useEffect(() => {
    return () => {
      clearTimeout(current.fn);
    };
  }, []);

  return useCallback(function (...args) {
    if (current.timer) {
      clearTimeout(current.timer);
    }
    current.timer = setTimeout(() => {
      current.fn.apply(this, args);
    }, delay);
  }, dep);
}
