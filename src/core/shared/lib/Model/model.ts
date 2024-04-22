import React from 'react'

import { useReactiveVar, type ReactiveVar } from '@apollo/client'

import type { DataHook, HookReturn, Transport } from './transport'
import { type Subscriber, type SubscribtionFn, createSubscribtionKey } from './utils'

export const createQuery = <P extends unknown[], Data>({
  useData,
  update
}: CreateQueryProps<P, Data>): QueryComponent<DataHook<P, Data>> => {
  const QueryNode: QueryComponent<DataHook<P, Data>> = ({ isMounted, ...props }) => {
    return !isMounted || isMounted?.()
      ? React.createElement<QueryProps<P, Data>>(Query, { ...props, update, useData })
      : null
  }

  return QueryNode
}

type QueryProps<P extends unknown[], Data> = QueryComponentProps<DataHook<P, Data>> &
  CreateQueryProps<P, Data>

type CreateQueryProps<P extends unknown[], Data> = {
  useData: DataHook<P, Data>
  update: (payload: {
    data?: Data
    isLoading: boolean
    controller: ReturnType<DataHook<P, Data>>
  }) => void
}

function Query<P extends unknown[], Data>({
  useData,
  query,
  update,
  onUpdate
}: QueryComponentProps<DataHook<P, Data>> & CreateQueryProps<P, Data>): React.ReactNode {
  const controller = useData(...query({ reaction: useReaction }))
  const { data, loading } = controller
  React.useEffect(() => {
    update({ data, isLoading: loading, controller })
  }, [loading, data])

  useSubscribeToUpdate(data, onUpdate)
  return null
}

const useReaction: Reaction = (VM) => {
  return useReactiveVar(VM.__def)
}

function useSubscribeToUpdate<THook extends DataHook>(
  data: ReturnType<THook>['data'],
  onUpdate?: UpdateHandler<THook>
): void {
  const { target, emit } =
    onUpdate?.({
      value(...keys) {
        return createSubscribtionKey(data as NonNullable<ReturnType<THook>['data']>, ...keys)
      }
    }) || {}

  const updated = data && target?.(data)

  React.useEffect(() => {
    if (updated) {
      emit?.(updated)
    }
  }, [updated])
}

export const createViewModel = <M extends Record<string, unknown>>(
  store: ReactiveVarsModel<M>
): ViewModel<M> => {
  const reactiveComponents = Object.entries(store).map(([key, value]) => [
    key,
    createReactiveComponent(value, store)
  ])

  const ViewModel = createVMComponent<M>(store) as ViewModel<M>
  Object.assign(ViewModel, Object.fromEntries(reactiveComponents))

  ViewModel.set = (key, value) => {
    return store[key](value)
  }

  return ViewModel
}

const createVMComponent = <M>(reactiveObject: ReactiveVarsModel<M>): VMComponent<M> => {
  const data = Object.entries(reactiveObject).map(
    ([k, v]) => [k, v as ReactiveVar<unknown>] as const
  )

  const useData = (): Partial<M> => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return Object.fromEntries(data.map(([k, v]) => [k, useReactiveVar(v)])) as M
  }

  return function VM<R extends Record<string, unknown>>({ render, ...rest }: VMProps<M, R>) {
    const props = { ...useData(), ...(rest as unknown as R) }
    return React.createElement(render, props)
  }
}
const createReactiveComponent = <M, V>(
  value: ReactiveVar<V>,
  store: ReactiveVarsModel<M>
): ReactiveComponent<M, V> => {
  const ModelValueRenderFn: ReactiveComponent<M, V> = function ({ render, ...rest }) {
    return React.createElement(render, {
      ...(rest as Parameters<typeof render>[0]),
      value: useReactiveVar(value),
      model: store
    })
  }
  ModelValueRenderFn.__def = value
  return ModelValueRenderFn
}

type ViewModel<M> = {
  [K in keyof M]: ReactiveComponent<M, M[K]>
} & {
  set<K extends keyof M>(key: K, value: M[K]): typeof value
} & VMComponent<M>

type VMComponent<M> = <R extends Record<string, unknown>>(
  props: VMProps<M, R>
) => React.ReactElement

type VMProps<M, R> = { render: React.FC<R & Partial<M>> } & R

type ReactiveVarsModel<M> = { [K in keyof M]: ReactiveVar<M[K]> }

type StoreValue<M, V> = { value?: V; model: ReactiveVarsModel<M> }

interface ReactiveComponent<M, V> {
  <R>(props: { render: React.FC<R & StoreValue<M, V>> } & Omit<R, 'value'>): React.ReactElement
  __def: ReactiveVar<V>
}

type QueryComponent<Hook extends DataHook> = React.FC<QueryComponentProps<Hook>>
type QueryComponentProps<Hook extends DataHook> = {
  query: (args: { reaction: Reaction }) => Parameters<Hook>
  onUpdate?: UpdateHandler<Hook>
  isMounted?: () => boolean
}

type Reaction = <M, V>(model: ReactiveComponent<M, V>) => V

type UpdateHandler<Hook extends DataHook> = (e: {
  value: SubscribtionFn<NonNullable<ReturnType<Hook>['data']>>
}) => Subscriber<NonNullable<ReturnType<Hook>['data']>, Parameters<typeof e['value']>>

export type StoreConstructor<T extends Transport, M extends Model<T>> = (
  transport: T,
  withSubscribtion?: boolean
) => M

type Gateway<T extends Transport, M> = {
  model: Partial<M>
  Query: QueryComponent<T['useFetch']>
  ViewModel: ViewModel<M>
}

export type Model<T extends Transport = Transport, S = unknown> = Gateway<T, ModelState<S>>

type ModelState<D> = {
  isLoading: boolean
} & D &
  Partial<Pick<HookReturn<D>, 'fetchMore' | 'refetch' | 'pagesCount'>>

export type ViewModelRenderProps<
  VM extends ViewModel<TModel>,
  propertyName extends keyof VM | undefined = undefined,
  TModel extends Record<string, unknown> = {}
> = propertyName extends keyof VM ? ExtractRenderProps<VM[propertyName]> : ExtractRenderProps<VM>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ExtractRenderProps<T extends (props: { render: (...args: any[]) => any }) => unknown> =
  Parameters<Required<Parameters<T>[0]>['render']>[0]
