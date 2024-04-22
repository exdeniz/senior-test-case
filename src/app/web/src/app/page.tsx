'use client'

import { ApolloClientProvider, RepoList } from '@/client-components'
import Image from 'next/image'
import { $orders } from '@frontend/core/entities/market'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import {
  OrderDirection,
  OrderState,
} from '@frontend/common/src/entities/Exchange/Order'

enum Markets {
  usdtusd = 'USDT/USD',
  usdteur = 'USDT/EUR',
  usdtrub = 'USDT/RUB',
}

export default function Home() {
  OrderState
  let [status, setStatus] = useState<OrderState>(OrderState.wait)
  let [direction, setDirection] = useState<OrderDirection>(OrderDirection.ask)
  let [market, setMarket] = useState<Markets>(Markets.usdtusd)

  const StateButtons = Object.keys(OrderState).map((key) => {
    const state = OrderState[key]
    return (
      <Button
        variant={status === state ? 'default' : 'outline'}
        onClick={() => setStatus(state)}
        key={state}
      >
        {state}
      </Button>
    )
  })
  const DirectionButtons = Object.keys(OrderDirection).map((key) => {
    const state = OrderDirection[key]
    return (
      <Button
        variant={direction === state ? 'default' : 'outline'}
        onClick={() => setDirection(state)}
        key={state}
      >
        {state}
      </Button>
    )
  })
  const MarketsButtons = Object.keys(Markets).map((key) => {
    const state = Markets[key]
    return (
      <Button
        variant={market === state ? 'default' : 'outline'}
        onClick={() => setMarket(state)}
        key={state}
      >
        {state}
      </Button>
    )
  })
  return (
    <ApolloClientProvider>
      <div className="flex flex-wrap gap-10 mb-20">
        <div>
          <h2 className="text-xl font-bold pb-3">Статус</h2>
          <div className="flex gap-3">{StateButtons}</div>
        </div>
        <div>
          <h2 className="text-xl font-bold pb-3">Направление</h2>
          <div className="flex gap-3">{DirectionButtons}</div>
        </div>
        <div>
          <h2 className="text-xl font-bold pb-3">Рынок</h2>
          <div className="flex gap-3">{MarketsButtons}</div>
        </div>
      </div>
      <$orders.Query query={() => [{ state: 'wait' }]} />
      <$orders.ViewModel.list ListComponent={RepoList} render={RepoList} />
    </ApolloClientProvider>
  )
}
