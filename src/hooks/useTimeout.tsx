import { useRef } from "react";

type useTimeoutContent = [(timeoutFn: NodeJS.Timeout) => void, () => void];

export default (): useTimeoutContent => {
  const timeoutRef = useRef<NodeJS.Timeout>();

  const setTimeout = (timeoutFn: NodeJS.Timeout) => {
    timeoutRef.current = timeoutFn;
  };

  const stopTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }
  };

  return [setTimeout, stopTimeout];
};
