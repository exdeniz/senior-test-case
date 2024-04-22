import { ApolloCache } from '@apollo/client'
import * as Paginator from '@frontend/common/src/features/pagination'
import {
  create as createOrder,
  Order,
} from '@frontend/common/src/entities/Exchange/Order'
import {
  GetUserOrdersQueryVariables,
  OrderFieldsFragmentDoc,
  PageInfo,
  useGetUserOrdersQuery,
} from '@frontend/common/src/generated-types'
import { FetchMore } from '@frontend/common/src/features/pagination/config'

type GetOrdersProps = Omit<
  GetUserOrdersQueryVariables,
  keyof CursorPaginationArguments | keyof IndexPaginationArguments
>

type CursorPaginationArguments = {
  after?: string
  before?: string
  first?: number
  last?: number
}

type IndexPaginationArguments = {
  page?: number
  perPage?: number
}

export type DataController<T> = {
  data: T
  totalCount: number | undefined
  fetchMore: FetchMore
  loading: boolean
  hasNextPage: boolean
  useWsConnection: () => void
  refetch: () => void
} & ReturnType<typeof Paginator.usePaginator>

export function hasNextPage(pageInfo?: PageInfo) {
  if (!pageInfo) {
    return false
  }
  return pageInfo.hasNextPage
}

export function useGetOrders(props: GetOrdersProps): DataController<Order[]> {
  let { data, client, ...rest } = Paginator.withPaginator({
    query: useGetUserOrdersQuery,
    options: (paginationProps) => ({
      variables: { ...props, ...paginationProps },
      //   notifyOnNetworkStatusChange: true
    }),
    getter: ({ data }) => data?.orders,
  })

  let edges = data?.orders && data.orders.edges
  let orders =
    edges?.map((edge) => createOrder(edge?.node)) || new Array<Order>()
  return {
    data: orders,
    // useWsConnection: WebSocketHooks.Trading.useOrdersConnection(
    //   updateOrders(client.cache)
    // ),
    ...rest,
  }
}

export type UpdateOrdersHandler = (data: Order[]) => void

// TODO: isSleep нужен из-за того что бэк присылает одинаковые сообщения (6 штук) с интервалом меньшн 2х секунд
// Нужно спросить у них - зачем?
let isSleep = false

// function updateOrders(cache: ApolloCache<unknown>): UpdateOrdersHandler {
//   return (data: Order[]) => {
//     if (isSleep) {
//       return
//     }

//     isSleep = true
//     setTimeout(() => {
//       isSleep = false
//     }, 3000)

//     let incomingOrdersRefs = data
//       .map((order) => {
//         return cache.writeFragment({
//           fragment: OrderFieldsFragmentDoc,
//           data: order.getChaceObject(),
//         })
//       })
//       .reverse()
//     cache.modify({
//       fields: {
//         exchange(prev, { readField }) {
//           let address = `orders:{"state":"wait"}`

//           let uniqIdsMap = new Map<string, boolean>()
//           let existingOrdersRefs = prev[address].edges.map(
//             (order) => order.node
//           )
//           let edges = [
//             ...existingOrdersRefs,
//             ...incomingOrdersRefs,
//             ...createdOrders.get(),
//           ].reduce((acc, orderEdge) => {
//             let id = readField('id', orderEdge) as string

//             if (uniqIdsMap.has(id) || cancelledOrders.get().includes(id)) {
//               return acc
//             } else {
//               uniqIdsMap.set(id, true)
//               let node = {
//                 cursor: id,
//                 node: orderEdge,
//                 __typename: 'OrderEdge',
//               }

//               return Array.prototype.concat(acc, node)
//             }
//           }, [])
//           uniqIdsMap.clear()

//           let orders = { ...prev[address], edges, totalCount: edges.length }

//           if (orders?.edges) {
//             return { ...prev, [address]: orders }
//           }
//           return prev
//         },
//       },
//     })

//     createdOrders.clear()
//     cancelledOrders.clear()
//   }
// }
