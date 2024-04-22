export type FilterModel<F extends Filter, D = undefined> = D extends undefined | never
  ? FilterMethods<F>
  : ClientsideFilter<F, D>

export interface FilterMethods<F extends Filter> {
  useFilterState(): FilterState<F>
  useFilterState<ID extends F['id']>(selector: ID): ExtractValue<ID, F> | undefined
  setFilter: (updater: UpdateFn<F>) => void
}

export type UpdateFn<F extends Filter> = (filters: { [Key in F['id']]: ExtractValue<Key, F> }) => F

export interface ClientsideFilter<F extends Filter, D> extends FilterMethods<F> {
  useFilter: (data?: D, extra?: F) => D
}

export type FilterState<F extends Filter> = { [Key in F['id']]: ExtractValue<Key, F> }

type ExtractValue<ID, F extends Filter> = Extract<F, { id: ID }>['value']

export type Filter = { id: number | string; value: unknown }

export type FilterRules<T, D> = (filter: T[], data: D) => D
