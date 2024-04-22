import { createGraphQLError } from 'graphql-yoga'
import { makeExecutableSchema } from '@graphql-tools/schema'
import type { GraphQLContext } from './context'
import { createSchema, createYoga } from 'graphql-yoga'

const typeDefinitions = /* GraphQL */ `
  type Order {
    id: Int!
    createdAt: String!
    ask: String!
    avgPrice: Float!
    bid: String!
    direction: String!
    executedVolume: Float!
    factor: Int!
    fixPrice: Float!
    fundsFee: Float!
    fundsReceived: Float!
    marketId: String!
    originVolume: Float!
    price: Float!
    received: Float!
    state: String!
    tradesCount: Int!
    type: String!
    volume: Float!
  }

  input PaginationInput {
    first: Int
    last: Int
    before: String
    after: String
  }

  type PageInfo {
    startCursor: String!
    endCursor: String!
    hasPreviousPage: Boolean!
    hasNextPage: Boolean!
  }
  type Pagination {
    currentPage: Int
    firstPage: Int
    lastPage: Boolean
    limitValue: Boolean
    nextPage: Int
    prevPage: Int
    totalPages: Int
  }

  type OrderConnection {
    edges: [OrderEdge!]!
    nodes: [Order!]!
    pageInfo: PageInfo!
    pagination: Pagination!
    totalCount: Int!
  }

  type OrderEdge {
    cursor: String!
    node: Order!
  }

  type Query {
    hello: String!
    orders(
      market: String
      state: String
      withTrades: Boolean
      currency: String
      type: String
      direction: String
      after: String
      before: String
      first: Int
      last: Int
      page: Int
      perPage: Int
    ): OrderConnection!
  }
`

const parseIntSafe = (value: string): number | null => {
  if (/^(\d+)$/.test(value)) {
    return parseInt(value, 10)
  }
  return null
}

const applyTakeConstraints = (params: {
  min: number
  max: number
  value: number
}) => {
  if (params.value < params.min || params.value > params.max) {
    throw createGraphQLError(
      `'take' argument value '${params.value}' is outside the valid range of '${params.min}' to '${params.max}'.`
    )
  }
  return params.value
}

const resolvers = {
  Query: {
    hello: () => `Hello World!`,
    orders: async (
      parent: unknown,
      args: {
        market?: string
        state?: string
        direction?: string
      },
      context: GraphQLContext
    ) => {
      const getOrders = await context.prisma.orders.findMany({
        where: {
          marketId: args.market ? { contains: args.market } : undefined,
          state: args.state ? { contains: args.state } : undefined,
          direction: args.direction ? { contains: args.direction } : undefined,
        },
      })
      return {
        edges: getOrders.map((item) => ({ cursor: item.id, node: item })),
        nodes: [...getOrders],
        pageInfo: {
          endCursor: 'MQ',
          hasNextPage: false,
          hasPreviousPage: false,
          startCursor: 'MQ',
        },
        pagination: {
          currentPage: 1,
          firstPage: true,
          lastPage: true,
          limitValue: 10,
          nextPage: null,
          prevPage: null,
          totalPages: 1,
        },
        totalCount: 250,
      }
    },
  },
}

export const schema = createSchema({
  resolvers: [resolvers],
  typeDefs: [typeDefinitions],
})
