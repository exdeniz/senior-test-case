import React from 'react'

import { useMediaQuery } from 'react-responsive'

import { labels } from '@frontend/core/entities/trade'
import { $market, $orderBook, $marketPrecision } from '@frontend/core/entities/market'

import { Tables } from '@frontend/core/shared/ui/web/tables'
import { CustomScroll } from '@frontend/core/shared/ui/web/scroll'
import { OrderDirections } from '@frontend/core/shared/api/models'

import { buyColumns, sellColumns } from './columns'

import './order-book.css'

import { ViewModelRenderProps } from '@frontend/core/shared/lib/Model'

const Tablet = '(max-width: 768px)'
const Table = Tables.Table

const OrderBook: React.FC<ViewProps> = ({ direction }) => {
  let isPhone = useMediaQuery({ query: Tablet })
  return (
    <div className='stock'>
      <$orderBook.Query query={({ reaction }) => [{ marketId: reaction($market.ViewModel.id) }]} />
      <$marketPrecision.Query
        query={({ reaction }) => [{ marketId: reaction($market.ViewModel.id) }]}
      />
      {isPhone ? (
        <View direction={direction} />
      ) : (
        <>
          <View direction={OrderDirections.SELL} />
          <View direction={OrderDirections.BUY} />
        </>
      )}
    </div>
  )
}

type ViewProps = {
  direction: OrderDirections
}

const View: React.FC<ViewProps> = ({ direction }) => {
  return (
    <div className='stockColumn'>
      <div className='stockHeader'>
        <labels.StockHeader direction={direction} />
      </div>
      <CustomScroll height={400}>
        <$orderBook.ViewModel.data direction={direction} render={RenderOrderBook} />
      </CustomScroll>
    </div>
  )
}

const RenderOrderBook: React.FC<
  ViewModelRenderProps<typeof $orderBook.ViewModel, 'data'> & ViewProps
> = ({ value, direction }) => (
  <Table
    data={(direction === OrderDirections.BUY ? value?.bid : value?.ask) || []}
    columns={direction === OrderDirections.SELL ? buyColumns : sellColumns}
  />
)

export default OrderBook
