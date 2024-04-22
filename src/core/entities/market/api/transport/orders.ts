// eslint-disable-next-line no-restricted-imports
import { useGetOrders } from '@frontend/common/src/services/apollo/queries/Exchange/getOrders'

// eslint-disable-next-line no-restricted-imports
import type { Order as OrderFromRequest } from '@frontend/common/src/entities/Exchange/Order'

import { modelTypes } from '@frontend/core/shared/api'

// eslint-disable-next-line no-restricted-imports
import type { OrdersTransport } from '../../contracts/Orders'

const request = useGetOrders

export const ordersTransport: OrdersTransport = {
  useFetch(
    payload = {
      state: 'wait',
    }
  ) {
    const { data, ...controller } = request(payload)
    // controller?.useWsConnection()

    const mappedData = ordersMapper(data)

    return {
      ...controller,
      data: mappedData,
    }
  },
}

const ordersMapper = (data?: OrderFromRequest[]): modelTypes.Order[] => {
  if (!data) return []
  return data.map((order) => ({
    ...order,
    price: { value: order.price, currencyId: order.amount.unit },
    volume: { ...order.volume, currency: order.volume.unit },
    amount: { ...order.amount, currency: order.amount.unit },
    baseValue: {
      ...order.volume,
      currencyId: order.volume.unit,
    },
    quoteValue: {
      ...order.amount,
      currencyId: order.amount.unit,
    },
    direction:
      order.direction === 0
        ? modelTypes.OrderDirections.SELL
        : modelTypes.OrderDirections.BUY,
    // factor: this.binanceEnabled ? data.factor : null
  }))
}
