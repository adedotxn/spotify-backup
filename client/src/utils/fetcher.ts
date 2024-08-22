export const fetcher = async <T>(
  ...args: [RequestInfo, RequestInit?]
): Promise<T> => {
  const res = await fetch(...args);
  const data = await res.json();

  if (!res.ok) {
    console.error(
      `Error during "${String(args[1]?.method).toUpperCase()}" request from ${String(args[0])} :`,
      data,
    );
    throw data;
  }

  return data as T;
};
