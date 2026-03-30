import { useCallback, useState } from 'react';

export const useFetchData = <T, Args extends unknown[]>(
  initialValue: T,
  asyncFunction: (...args: Args) => Promise<T>,
) => {
  const [defaultValue] = useState(initialValue);

  const [isLoading, setLoading] = useState(false);
  const [result, setResult] = useState<T>(initialValue);
  const [isError, setError] = useState<unknown>(null);

  const handleResponse = useCallback(
    async (...args: Args) => {
      try {
        setLoading(true);
        const data = await asyncFunction(...args);
        setResult(data);

        return data;
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [asyncFunction],
  );

  const handleReset = useCallback(() => {
    setLoading(false);
    setResult(defaultValue);
    setError(null);
  }, [defaultValue]);

  return {
    isLoading,
    result,
    isError,
    handleResponse,
    handleReset,
  };
};
