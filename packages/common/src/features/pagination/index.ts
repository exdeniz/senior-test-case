import React from 'react'

import {
  activePaginators,
  DEFAULT_PAGINATOR,
  LIMIT,
  Paginator,
  PaginatorFactory,
  paginators,
  PaginatorTypes
} from './config'

let selectedPaginator: PaginatorFactory = paginators[DEFAULT_PAGINATOR]

const getPaginator = (type?: (arg: typeof PaginatorTypes) => PaginatorTypes) => {
  if (type) {
    return paginators[type(PaginatorTypes)]
  }
  return selectedPaginator
}

function usePaginator() {
  let [paginator, paginationOptions, update] = React.useMemo(() => getPaginator().make(), [])
  return [paginator, paginationOptions, update] as const
}

export const setPaginator = (selector: (type: typeof PaginatorTypes) => PaginatorTypes): void => {
  selectedPaginator = paginators[selector(PaginatorTypes)]
}

export function withPaginator<D>({
  query,
  options,
  getter
}: Props<D>): PaginatedController<typeof query> {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  let [paginator, paginationOptions, update] = usePaginator()
  let controller = query({ ...options({ ...paginationOptions }) })

  update({ data: getter(controller), fetchMore: controller.fetchMore })
  return { ...controller, ...paginator }
}

function mergePaginatedData(existing, incoming, options) {
  let paginator = activePaginators[options.variables.paginatorId]
  return paginator.merge(existing, incoming, options)
}

function readPaginatedData(data, options) {
  let paginator = activePaginators[options.variables.paginatorId]

  return paginator.read?.(data, options)
}
type Props<TResult, Q extends Query<TResult> = Query<TResult>> = {
  query: Q
  options: (paginationProps) => QueryVariables<Q>
  getter: (data: Pick<ReturnType<Q>, 'data'>) => unknown
}

type Query<TResut, TArgs extends unknown[] = never[]> = (...args: TArgs) => TResut

type QueryVariables<Q> = Required<Parameters<Q>>[0]['variables']

type QueryData<Q> = ReturnType<Q>['data']

type DataExtractor<D> = ({ data }: { data: D }) => unknown

export const PaginatedQuery = <Q extends Query<D>, G extends DataExtractor<QueryData<Q>>, D>(
  query: Q,
  payload: QueryVariables<Q>,
  getter: G
): PaginatedController<Q> =>
  withPaginator({
    query,
    options: (paginationProps) => ({
      variables: { ...payload, ...paginationProps },
      pollInterval: 20000
    }),
    getter
  })

type PaginatedController<Q extends Query<unknown>> = Omit<ReturnType<Q>, 'fetchMore'> &
  Paginator<any>

export const limit = LIMIT

export function pagination(keyArgs) {
  if (keyArgs === void 0) {
    keyArgs = false
  }
  return {
    keyArgs,
    merge: mergePaginatedData,
    read: readPaginatedData
  }
}
