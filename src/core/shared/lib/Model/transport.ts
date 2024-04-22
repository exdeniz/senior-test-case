export interface Transport<Payload extends unknown[] = never[], Response = unknown> {
  useFetch: (...args: Payload) => HookReturn<Response>
  useSubscribe?: (...args: Payload) => HookReturn<Response>
}

export type HookReturn<D> = {
  data?: D
  loading: boolean
  refetch: () => Promise<unknown>
  fetchMore?: (...args: unknown[]) => Promise<unknown>
  pagesCount?: number
  totalCount?: number
}

export type DataHook<P extends unknown[] = [], D = unknown> = (...args: P) => HookReturn<D>
