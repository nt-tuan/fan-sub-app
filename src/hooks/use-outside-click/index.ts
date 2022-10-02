import React from "react";

const defaultEvents = ["mousedown", "touchstart"];

const useOutsideClick = (
  ref: React.RefObject<HTMLElement>,
  callback: () => void,
  events: string[] = defaultEvents
) => {
  React.useEffect(() => {
    if (ref.current == null) return;

    const listener = (event: { target?: unknown }) => {
      if (ref.current && !ref.current.contains(event.target as never)) {
        callback();
      }
    };
    for (const event of events) {
      document.addEventListener(event, listener);
    }

    return () => {
      for (const event of events) {
        document.removeEventListener(event, listener);
      }
    };
  }, [callback, ref, events]);

  return ref;
};

export default useOutsideClick;
