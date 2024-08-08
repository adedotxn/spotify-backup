export const fetcher = (...args: [RequestInfo, RequestInit?]): Promise<unknown> =>
    fetch(...args).then(res => res.json());
