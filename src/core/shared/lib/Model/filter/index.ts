import React from 'react'

import { makeVar, useReactiveVar, type ReactiveVar } from '@apollo/client'

import type { Filter, FilterModel, FilterRules, UpdateFn } from './types'

export function createStore<D, T extends Filter>(
  initials: T[],
  filterFn?: FilterRules<T, D>,
  updateFilterStrategy: typeof mergeFilterStrategy = mergeFilterStrategy
): typeof filterFn extends undefined ? FilterModel<T> : FilterModel<T, D> {
  const filter = makeVar(new Set(initials))
  const store: FilterModel<T, unknown> = {
    useFilterState: (filterId?: T['id']) => {
      const filters = [...useReactiveVar(filter)]
      return filterId === undefined
        ? toObject(filters)
        : (filters.find(({ id }) => id === filterId)?.value as { [K in T['id']]: T['value'] })
    },
    setFilter: updateFilterStrategy(filter, initials)
  } as FilterModel<T, unknown>

  if (filterFn) {
    store.useFilter = (data, extra) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const filtersState = useReactiveVar(filter)
      // eslint-disable-next-line react-hooks/rules-of-hooks
      return React.useMemo(
        () =>
          filterFn(
            extra ? ([...filtersState].concat(extra) as T[]) : ([...filtersState] as T[]),
            data as D
          ),
        [filtersState, data, extra]
      )
    }
  }

  return store as FilterModel<T, D>
}

const mergeFilterStrategy =
  <T extends Filter>(filterState: ReactiveVar<Set<T>>, initials: T[]) =>
  (updater: UpdateFn<T>) => {
    const previosState = toObject([...filterState()])
    const newValue = updater(previosState)
    const prevValue = initials.find(({ id }) => id === newValue.id) as T

    prevValue.value = newValue.value
    filterState().add(prevValue)
    filterState(new Set([...filterState()]))
  }

export const resetPreviousStrategy =
  <T extends Filter>(filterState: ReactiveVar<Set<T>>) =>
  (updater: UpdateFn<T>) => {
    const previosState = toObject([...filterState()])
    const newValue = updater(previosState)

    filterState(new Set([newValue]))
  }

export function toObject<T extends Filter>(filter: T[]): { [K in T['id']]: T['value'] } {
  return filter.reduce((acc, filterState) => {
    return { ...acc, [filterState.id]: filterState.value }
  }, {} as { [K in T['id']]: T['value'] })
}

export type { FilterModel, FilterRules } from './types'
