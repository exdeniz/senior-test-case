// eslint-disable-next-line no-restricted-imports
import { useGetOrders } from '@frontend/common/src/services/apollo/queries/Exchange/getOrders'

import type { Order } from '@frontend/core/shared/api/models'

import type { Transport, Model } from '@frontend/core/shared/lib/Model'

export type OrdersModel = Model<
  OrdersTransport,
  {
    list: Order[]
    totalCount: number
  }
>

type Payload = Parameters<typeof useGetOrders>

export type OrdersTransport = Transport<Payload, Order[]>
