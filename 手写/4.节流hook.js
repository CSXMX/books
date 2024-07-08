import { useEffect, useRef, useCallback } from "react";

export default function (fn, delay, dep = []) {
  const { current } = useRef({ fn, timer: null });

  useEffect(() => {
    current.fn = fn;
  }, [fn]);

  useEffect(() => {
    return () => {
      clearTimeout(current.fn);
    };
  }, []);

  return useCallback(function (...args) {
    if (!current.timer) {
      current.timer = setTimeout(() => {
        current.fn.apply(this, args);
        delete current.timer;
      }, delay);
    }
  }, []);
}
