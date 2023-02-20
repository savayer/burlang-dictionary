import { useCallback, useState } from 'react';

export const useFetchData = (initialValue, asyncFunction) => {
  const [defaultValue] = useState(initialValue);

  const [isLoading, setLoading] = useState(false);
  const [result, setResult] = useState(initialValue);
  const [isError, setError] = useState(null);

  const handleResponse = useCallback(
    async (...args) => {
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
