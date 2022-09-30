import React from "react";

const events = ["lostpointercapture", "mousedown", "touchstart"];
const useOutsideClick = (
  ref: React.RefObject<HTMLElement>,
  callback: () => void
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
  }, [callback, ref]);

  return ref;
};

export default useOutsideClick;
