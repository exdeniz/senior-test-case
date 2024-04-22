
type CurrencyValue = { value: number; currencyId: string }


export enum AccountType {
  COIN = 'coin',
  FIAT = 'fiat'
}


type SubmittedOrderSpecs = {
  dateTime: Date
  state: string
}

export type Order<T = OrderTypes> = {
  // getTypeName: (marketId: string) => [string, ...object[]]
  id: string
  type: T
  price: CurrencyValue
  feeValue?: number
  baseValue: CurrencyValue
  quoteValue: CurrencyValue
  factor?: number
  direction: OrderDirections
} & SubmittedOrderSpecs

export enum OrderDirections {
  SELL = 'sell',
  BUY = 'buy'
}

export enum OrderTypes {
  MARKET = 'market',
  LIMIT = 'limit',
  FACTOR = 'factor'
}

export enum OrderBase {
  AMOUNT = 'amount',
  TOTAL = 'total'
}

export enum OrderCurrency {
  BASE = 'base',
  QUOTE = 'quote'
}

export enum OrderBookDirection {
  ASK,
  BID
}

export type Blocked = {
  currencyId: string
  blocked: CurrencyValue
  deal: CurrencyValue
  order: CurrencyValue
  withdraw: CurrencyValue
}
