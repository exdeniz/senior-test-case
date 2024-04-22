import { relayStylePagination } from '@apollo/client/utilities'

export enum PaginatorTypes {
  OFFSET_BASED,
  CURSOR_BASED,
}
export type PaginatorFactory = {
  id: number
  make: GenericReturn<CursorPaginator | OffsetPaginator>
}

type GenericReturn<Type> = () => [Type, {}, ({ data, fetchMore }) => void]

const update =
  (state, fetchRef) =>
  ({ data: newState, fetchMore }) => {
    if (newState) {
      state = Object.assign(state, {
        after: newState.pageInfo?.endCursor,
        totalCount: newState.totalCount,
        hasNextPage: newState.pageInfo?.hasNextPage,
        hasPreviousPage: newState.pageInfo.hasPreviousPage,
        pagesCount: Math.ceil(newState.totalCount / state.limit),
      })
    }
    fetchRef.execute = fetchMore
  }

export const id = Symbol('id')

export const activePaginators = {}

function getId(): number {
  let existing = Object.keys(activePaginators)
  let last = existing[existing.length - 1]
  return Number(last) + 1 || 1
}

const make: GenericReturn<CursorPaginator> = () => {
  let state_ = {
    state: {
      after: undefined,
      before: undefined,
      totalCount: 0,
      hasNextPage: false,
      hasPreviousPage: false,
      limit: LIMIT,
      pagesCount: 0,
    },
    update,
  }
  let fetchMoreRequest = {
    execute: undefined,
  }
  let newId = getId()
  let paginationProps = { first: LIMIT, after: undefined, [id]: newId }

  let paginator: CursorPaginator = {
    fetchMore: (args) => {
      let variables = { variables: { ...args, ...paginator } }
      paginationProps.after = variables.variables.after

      return fetchMoreRequest.execute?.(variables)
    },
    totalCount: state_.state.totalCount,
    hasNextPage: state_.state.hasNextPage,
    hasPreviousPage: state_.state.hasPreviousPage,
    limit: state_.state.limit,
    pagesCount: Math.ceil(state_.state.totalCount / state_.state.limit),
  }
  let reader = {
    merge: (...args) => relayStylePagination().merge(...args),
    read: (data) => data,
  }

  activePaginators[newId] = reader

  return [
    paginator,
    paginationProps,
    state_.update(paginator, fetchMoreRequest),
  ]
}

const make2: GenericReturn<OffsetPaginator> = () => {
  let state_ = {
    state: {
      offset: 0,
      totalCount: 0,
      hasNextPage: false,
      hasPreviousPage: false,
      limit: LIMIT,
      pagesCount: 0,
    },
    update,
  }
  let fetchMoreRequest = {
    execute: undefined,
  }
  let newId = getId()
  let paginationProps = { perPage: LIMIT, page: 1, paginatorId: newId }

  let paginator: OffsetPaginator = {
    fetchMore: (args) => {
      let page = args.offset / LIMIT + 1
      paginationProps.page = page
      let variables = { variables: { page } }

      if (!args) {
        return fetchMoreRequest.execute(variables)
      }
      return fetchMoreRequest.execute(variables)
    },
    totalCount: state_.state.totalCount,
    hasNextPage: state_.state.hasNextPage,
    hasPreviousPage: state_.state.hasPreviousPage,
    limit: state_.state.limit,
    pagesCount: Math.ceil(state_.state.totalCount / state_.state.limit),
  }
  let reader = {
    merge: (existing, incoming, options) => {
      let { args } = options
      let merged = existing ? existing.edges.slice(0) : []
      if (args) {
        let page = args.page
        let limit = args.perPage
        let _b = (page - 1) * limit
        let offset = _b === void 0 ? 0 : _b
        for (let i = 0; i < incoming.edges.length; ++i) {
          merged[offset + i] = incoming.edges[i]
        }
      } else {
        merged.push.apply(merged, incoming.edges)
      }
      return { ...incoming, edges: merged }
    },
    read: (data, options) => {
      let {
        args: { page, perPage },
      } = options
      let offset = 0
      let edges = data && data.edges.slice(offset, offset + perPage)

      edges?.filter((edge) => {
        options.canRead(edge.node)
        return options.canRead(edge.node)
      })

      if (page > 1) {
        offset = (page - 1) * perPage
        edges = data && data.edges.slice(offset, offset + perPage)

        return data && { ...data, edges }
      }

      return data && { ...data, edges }
    },
  }

  activePaginators[newId] = reader

  return [
    paginator,
    paginationProps,
    state_.update(paginator, fetchMoreRequest),
  ]
}

export const paginators: Record<PaginatorTypes, PaginatorFactory> = {
  [PaginatorTypes.CURSOR_BASED]: {
    id: 1,
    make,
  },
  [PaginatorTypes.OFFSET_BASED]: {
    id: 2,
    make: make2,
  },
}

export const DEFAULT_PAGINATOR = PaginatorTypes.CURSOR_BASED

type FetchMoreFn<TArgs, TData> = (args: TArgs) => Promise<TData>

type CursotFetchMoreArgs = {}

type OffsetFetchMoreArgs = {
  offset?: number
}

export type Paginator<TFetchFn> = {
  fetchMore: FetchFn<TFetchFn>
  totalCount: number
  hasNextPage: boolean
  hasPreviousPage: boolean
  limit: number
  pagesCount: number
}

type CursorPaginator = Paginator<CursotFetchMoreArgs>

type OffsetPaginator = Paginator<OffsetFetchMoreArgs>

type FetchFn<T> = FetchMoreFn<T, unknown>

export type FetchMore =
  | FetchFn<CursotFetchMoreArgs>
  | FetchFn<OffsetFetchMoreArgs>

export const LIMIT = 10
