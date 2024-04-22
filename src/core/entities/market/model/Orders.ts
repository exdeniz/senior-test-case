// eslint-disable-next-line no-restricted-imports
import { createStore } from '@frontend/core/entities/market/lib/apollo-store/Orders'

// eslint-disable-next-line no-restricted-imports
import { ordersTransport } from '../api/transport/orders'
// eslint-disable-next-line no-restricted-imports
import type { OrdersModel } from '../contracts'

export const $orders = {} as OrdersModel

const createOrdersModel = (gateway: OrdersModel): void => {
  Object.assign(gateway, createStore(ordersTransport))
}

createOrdersModel($orders)
