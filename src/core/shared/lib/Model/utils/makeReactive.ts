import { makeVar, type ReactiveVar } from '@apollo/client'

export const update = <T extends object>(
  data: T,
  reactive: {
    [K in keyof T]?: ReactiveVar<T[K]>
  }
): void => {
  Object.entries(data).forEach(([key, value]) => {
    reactive[key as keyof typeof reactive]?.(value as T[keyof T])
  })
}

export const makeReactive = <T extends object>(
  obj: T
): {
  [K in keyof T]-?: ReactiveVar<T[K]>
} => {
  return Object.entries(obj).reduce(
    (res, [key, value]) => ({ ...res, [key]: makeVar(value) }),
    {} as {
      [K in keyof T]-?: ReactiveVar<T[K]>
    }
  )
}
