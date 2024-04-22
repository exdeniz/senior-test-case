import { gql } from '@apollo/client';
import * as ApolloReactCommon from '@apollo/client';
import * as ApolloReactHooks from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Order = {
  __typename?: 'Order';
  ask: Scalars['String'];
  avgPrice: Scalars['Float'];
  bid: Scalars['String'];
  createdAt: Scalars['String'];
  direction: Scalars['String'];
  executedVolume: Scalars['Float'];
  factor: Scalars['Int'];
  fixPrice: Scalars['Float'];
  fundsFee: Scalars['Float'];
  fundsReceived: Scalars['Float'];
  id: Scalars['Int'];
  marketId: Scalars['String'];
  originVolume: Scalars['Float'];
  price: Scalars['Float'];
  received: Scalars['Float'];
  state: Scalars['String'];
  tradesCount: Scalars['Int'];
  type: Scalars['String'];
  volume: Scalars['Float'];
};

export type OrderConnection = {
  __typename?: 'OrderConnection';
  edges: Array<OrderEdge>;
  nodes: Array<Order>;
  pageInfo: PageInfo;
  pagination: Pagination;
  totalCount: Scalars['Int'];
};

export type OrderEdge = {
  __typename?: 'OrderEdge';
  cursor: Scalars['String'];
  node: Order;
};

export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor: Scalars['String'];
  hasNextPage: Scalars['Boolean'];
  hasPreviousPage: Scalars['Boolean'];
  startCursor: Scalars['String'];
};

export type Pagination = {
  __typename?: 'Pagination';
  currentPage?: Maybe<Scalars['Int']>;
  firstPage?: Maybe<Scalars['Int']>;
  lastPage?: Maybe<Scalars['Boolean']>;
  limitValue?: Maybe<Scalars['Boolean']>;
  nextPage?: Maybe<Scalars['Int']>;
  prevPage?: Maybe<Scalars['Int']>;
  totalPages?: Maybe<Scalars['Int']>;
};

export type PaginationInput = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};

export type Query = {
  __typename?: 'Query';
  hello: Scalars['String'];
  orders: OrderConnection;
};


export type QueryOrdersArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  currency?: InputMaybe<Scalars['String']>;
  direction?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  market?: InputMaybe<Scalars['String']>;
  page?: InputMaybe<Scalars['Int']>;
  perPage?: InputMaybe<Scalars['Int']>;
  state?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<Scalars['String']>;
  withTrades?: InputMaybe<Scalars['Boolean']>;
};

export type OrderFieldsFragment = { __typename?: 'Order', ask: string, avgPrice: number, bid: string, createdAt: string, direction: string, executedVolume: number, factor: number, fixPrice: number, fundsFee: number, fundsReceived: number, id: number, marketId: string, originVolume: number, price: number, received: number, state: string, tradesCount: number, type: string, volume: number };

export type PageInfoFieldsFragment = { __typename?: 'PageInfo', endCursor: string, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string };

export type PaginationFieldsFragment = { __typename?: 'Pagination', currentPage?: number | null, firstPage?: number | null, lastPage?: boolean | null, limitValue?: boolean | null, nextPage?: number | null, prevPage?: number | null, totalPages?: number | null };

export type GetUserOrdersQueryVariables = Exact<{
  market?: InputMaybe<Scalars['String']>;
  state?: InputMaybe<Scalars['String']>;
  withTrades?: InputMaybe<Scalars['Boolean']>;
  currency?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<Scalars['String']>;
  direction?: InputMaybe<Scalars['String']>;
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  perPage?: InputMaybe<Scalars['Int']>;
}>;


export type GetUserOrdersQuery = { __typename?: 'Query', orders: { __typename?: 'OrderConnection', totalCount: number, edges: Array<{ __typename?: 'OrderEdge', cursor: string, node: { __typename?: 'Order', ask: string, avgPrice: number, bid: string, createdAt: string, direction: string, executedVolume: number, factor: number, fixPrice: number, fundsFee: number, fundsReceived: number, id: number, marketId: string, originVolume: number, price: number, received: number, state: string, tradesCount: number, type: string, volume: number } }>, pageInfo: { __typename?: 'PageInfo', endCursor: string, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string }, pagination: { __typename?: 'Pagination', currentPage?: number | null, firstPage?: number | null, lastPage?: boolean | null, limitValue?: boolean | null, nextPage?: number | null, prevPage?: number | null, totalPages?: number | null } } };

export const OrderFieldsFragmentDoc = gql`
    fragment OrderFields on Order {
  ask
  avgPrice
  bid
  createdAt
  direction
  executedVolume
  factor
  fixPrice
  fundsFee
  fundsReceived
  id
  marketId
  originVolume
  price
  received
  state
  tradesCount
  type
  volume
}
    `;
export const PageInfoFieldsFragmentDoc = gql`
    fragment PageInfoFields on PageInfo {
  endCursor
  hasNextPage
  hasPreviousPage
  startCursor
}
    `;
export const PaginationFieldsFragmentDoc = gql`
    fragment PaginationFields on Pagination {
  currentPage
  firstPage
  lastPage
  limitValue
  nextPage
  prevPage
  totalPages
}
    `;
export const GetUserOrdersDocument = gql`
    query GetUserOrders($market: String, $state: String, $withTrades: Boolean, $currency: String, $type: String, $direction: String, $after: String, $before: String, $first: Int, $last: Int, $page: Int, $perPage: Int) {
  orders(
    market: $market
    state: $state
    withTrades: $withTrades
    type: $type
    direction: $direction
    currency: $currency
    after: $after
    before: $before
    first: $first
    last: $last
    page: $page
    perPage: $perPage
  ) {
    ... on OrderConnection {
      edges {
        cursor
        node {
          ...OrderFields
        }
      }
      pageInfo {
        ...PageInfoFields
      }
      pagination {
        ...PaginationFields
      }
      totalCount
    }
  }
}
    ${OrderFieldsFragmentDoc}
${PageInfoFieldsFragmentDoc}
${PaginationFieldsFragmentDoc}`;

/**
 * __useGetUserOrdersQuery__
 *
 * To run a query within a React component, call `useGetUserOrdersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserOrdersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserOrdersQuery({
 *   variables: {
 *      market: // value for 'market'
 *      state: // value for 'state'
 *      withTrades: // value for 'withTrades'
 *      currency: // value for 'currency'
 *      type: // value for 'type'
 *      direction: // value for 'direction'
 *      after: // value for 'after'
 *      before: // value for 'before'
 *      first: // value for 'first'
 *      last: // value for 'last'
 *      page: // value for 'page'
 *      perPage: // value for 'perPage'
 *   },
 * });
 */
export function useGetUserOrdersQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetUserOrdersQuery, GetUserOrdersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetUserOrdersQuery, GetUserOrdersQueryVariables>(GetUserOrdersDocument, options);
      }
export function useGetUserOrdersLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetUserOrdersQuery, GetUserOrdersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetUserOrdersQuery, GetUserOrdersQueryVariables>(GetUserOrdersDocument, options);
        }
export type GetUserOrdersQueryHookResult = ReturnType<typeof useGetUserOrdersQuery>;
export type GetUserOrdersLazyQueryHookResult = ReturnType<typeof useGetUserOrdersLazyQuery>;
export type GetUserOrdersQueryResult = ApolloReactCommon.QueryResult<GetUserOrdersQuery, GetUserOrdersQueryVariables>;