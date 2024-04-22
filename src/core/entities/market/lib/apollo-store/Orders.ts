// eslint-disable-next-line no-restricted-imports
import type { OrdersModel, OrdersTransport } from '@frontend/core/entities/market/contracts'

import {
  type StoreConstructor,
  createQuery,
  createViewModel
} from '@frontend/core/shared/lib/Model/model'
import type { Order } from '@frontend/core/shared/api/models'
import { makeReactive, update } from '@frontend/core/shared/lib/Model/utils'

export const createStore: StoreConstructor<OrdersTransport, OrdersModel> = (transport) => {
  const model = {
    list: [] as Order[],
    isLoading: true,
    totalCount: 0
  }

  const reactiveObject = makeReactive(model)

  return {
    model,
    Query: createQuery({
      useData: transport.useFetch,
      update: ({ data, isLoading, controller }) => {
        const modelProps = {
          pagesCount: controller.pagesCount,
          totalCount: controller.totalCount,
          list: data,
          isLoading,
          fetchMore: async (...args: unknown[]) => {
            reactiveObject.isLoading(true)
            await controller.fetchMore?.(...args)
            reactiveObject.isLoading(false)
          },
          refetch: () => {
            reactiveObject.isLoading(true)
            controller.refetch().then(() => {
              reactiveObject.isLoading(false)
            })
          }
        }
        Object.assign(model, modelProps)

        if (data) {
          update({ list: data }, reactiveObject)
        }

        if (controller.totalCount !== undefined) {
          update({ totalCount: controller.totalCount }, reactiveObject)
        }

        reactiveObject.isLoading(isLoading)
      }
    }),
    ViewModel: createViewModel(reactiveObject)
  }
}
