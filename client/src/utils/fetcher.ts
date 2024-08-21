export const fetcher = async <T>(
  ...args: [RequestInfo, RequestInit?]
): Promise<T> => {
  const res = await fetch(...args);
  const data = await res.json();

  if (!res.ok) {
    console.error("Error during fetch:", data);
    throw data;
  }

  return data as T;
};
