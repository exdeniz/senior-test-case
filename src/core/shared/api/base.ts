export type BaseDataController<D> = {
  data: D
  loading: boolean
}

export type DataController<D> = BaseDataController<D> & {
  pagesCount: number
  fetchMore: ({ offset }: { offset: number }) => void
}

export type ApolloDataController<D> = BaseDataController<D> & {
  // Тут применяется сложный, автосгенерированный тип
  //   (variables?: Partial<Exact<{
  //     [key: string]: never;
  //    }>> | undefined) => Promise<...>
  // но пока оставлю упрощённую версию
  refetch: (variables?: unknown) => Promise<void>
}

export type PageChangeEventHandler = (offset: number) => void
