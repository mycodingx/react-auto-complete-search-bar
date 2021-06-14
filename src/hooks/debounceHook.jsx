import React, { useState, useEffect } from "react";

export function useDebounce(value, timeout, callback) {
  const [timer, setTimer] = useState();

  const clearTimer = () => {
    if (timer) clearTimeout(timer);
  };

  useEffect(() => {
    clearTimer();
    if (value && callback) {
      const newTimer = setTimeout(callback, timeout);
      setTimer(newTimer);
    }
  }, [value]);
}
