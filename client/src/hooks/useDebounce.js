import { useEffect, useState } from 'react';

/**
 * Debounce delays API calls until the user stops typing.
 * e.g. 300ms delay → 1 request per pause instead of 1 per keystroke.
 */
export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
