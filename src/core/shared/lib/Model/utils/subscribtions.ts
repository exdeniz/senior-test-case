export function createSubscribtionKey<TData extends Acc, Keys extends KeyArgs<TData>>(
  obj: TData,
  ...keys: Keys
): Action<TData, Keys> {
  return {
    execute: (event) => ({
      target: (data) =>
        (keys as KeysRestriction).reduce(
          (acc, elem) => (hasProperty(acc, elem) ? acc[elem] : acc) as Reducer<Keys, TData>,
          data
        ) as Reducer<Keys, TData>,
      emit: (data) => {
        event(data)
      }
    })
  }
}

const hasProperty = <Obj extends Record<Prop, unknown>, Prop extends Primitives>(
  obj: Obj,
  prop: Prop
): obj is Obj => Object.prototype.hasOwnProperty.call(obj, prop)

interface Action<TData, K extends KeyArgs<TData> = KeyArgs<TData>> {
  execute: (event: (data: Reducer<K, TData>) => void) => Subscriber<TData, K>
}

export interface Subscriber<TData, K extends KeyArgs<TData>> {
  target: Subscribtion<K, TData>
  emit: (data: Reducer<K, TData>) => void
}

type Subscribtion<Keys extends KeyArgs<TData>, TData> = (data: TData) => Reducer<Keys, TData>

type KeysRestriction = string[] | [number, ...string[]]

type KeyArgs<TData> = (KeysUnion<TData> & KeysRestriction) | []

export type SubscribtionFn<TData extends Acc> = <Keys extends KeyArgs<TData>>(
  ...keys: Keys
) => Action<TData, Keys>

/**
 * Common utils
 */

type Primitives = string | number | symbol

type Acc = Record<KeysRestriction[number], unknown>

// (acc, elem) => hasProperty(acc, elem) ? acc[elem] : acc
type Predicate<
  Accumulator extends Acc | Acc[keyof Acc],
  El extends KeysRestriction[number]
> = El extends keyof Accumulator ? Accumulator[El] : Accumulator

type Reducer<Keys extends KeysRestriction, Accumulator extends Acc | Acc[Keys[number]] = {}> =
  /**
   *  If Keys is empty array, no need to call recursion,
   *  just return Accumulator
   */
  Keys extends []
    ? Accumulator
    : /**
     * If Keys is an Array of more than one element
     */
    Keys extends [infer H, ...infer Tail]
    ? Tail extends KeysRestriction
      ? H extends KeysRestriction[number]
        ? /**
           * Call recursion with Keys Tail
           * and call predicate with first element
           */
          // Predicate<Accumulator, H> extends Acc
          Reducer<Tail, Predicate<Accumulator, H>>
        : never
      : never
    : never

type KeysUnion<T, Cache extends Primitives[] = []> = T extends Primitives
  ? Cache
  : {
      [P in keyof T]: [...Cache, P] | KeysUnion<T[P], [...Cache, P]>
    }[keyof T]

// type ValuesUnion<T, Cache = T> = T extends Primitives
//   ? T
//   : Values<{
//       [P in keyof T]: Cache | T[P] | ValuesUnion<T[P], Cache | T[P]>
//     }>
// type Values<T> = T[keyof T]
