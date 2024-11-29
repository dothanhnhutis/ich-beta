export function useStore(key: string): [string | null, (data: string) => void] {
  const data: string | null =
    typeof window != "undefined" ? window.localStorage.getItem(key) : null;

  const handleSetData = (data: string): void => {
    if (typeof window != "undefined") window.localStorage.setItem(key, data);
  };

  return [data, handleSetData];
}
