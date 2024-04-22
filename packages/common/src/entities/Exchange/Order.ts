import { OrderFieldsFragment } from '@frontend/common/src/generated-types'

export type UnitValue<V, U> = {
  value: V
  unit: U
}

export function createUnitValue(value, unit) {
  return {
    value,
    unit,
  }
}

export type Order = {
  id: string
  dateTime: Date
  type: string
  direction: OrderDirection
  price: number
  priceUnit: string
  volume: UnitValue<number, string>
  executedVolume: UnitValue<number, string>
  state: OrderState
  received: UnitValue<number, string>
  avgPrice?: number | null
  amount: UnitValue<number, string>
  factor: number
  marketId: string
  getChaceObject: () => OrderFieldsFragment
}

export enum OrderState {
  wait = 'Wait',
  active = 'Active',
  completed = 'Completed',
  filled = 'Filled',
}

export enum OrderDirection {
  ask = 'Ask',
  bid = 'Bid',
}

function makeDateTime(dateTime: number) {
  return new Date(dateTime * 1000)
}

export function create(props: OrderFieldsFragment): Order {
  let price = props.price
  return {
    id: props.id,
    dateTime: makeDateTime(props.createdAt),
    type: props.type,
    direction: OrderDirection[props.direction],
    price,
    priceUnit: props.bid,
    volume:
      props.direction === 'ask'
        ? createUnitValue(props.volume, props.ask)
        : createUnitValue((1 / price) * props.volume, props.ask),
    executedVolume: createUnitValue(
      props.executedVolume,
      props.direction === 'ask' ? props.ask : props.bid
    ),
    state: OrderState[props.state],
    tradesCount: props.tradesCount,
    received: createUnitValue(
      props.received,
      props.direction === 'ask' ? props.bid : props.ask
    ),
    avgPrice: props.avgPrice,
    factor: props.factor,
    marketId: props.marketId,
    amount:
      props.direction === 'ask'
        ? createUnitValue(price * props.volume, props.bid)
        : createUnitValue(props.volume, props.bid),
    getChaceObject: (): OrderFieldsFragment => {
      return { ...props, __typename: 'Order' }
    },
  }
}
