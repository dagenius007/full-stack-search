import { useEffect, useState } from "react";

function useDebounce<T>(value: T, delay = 300): T {
  const [debounceValue, setDebounceValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounceValue(value);
    }, delay);
    return () => {
      clearTimeout(timer);
    };
  }, [delay, value]);

  return debounceValue;
}

export default useDebounce;
