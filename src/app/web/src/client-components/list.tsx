import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
export function RepoList(props) {
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Дата и время</TableHead>
            <TableHead>Тип</TableHead>
            <TableHead>Направление</TableHead>
            <TableHead>ID рынка</TableHead>
            <TableHead>Цена</TableHead>
            <TableHead>Единица цены</TableHead>
            <TableHead>Объем</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {props.value.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.id}</TableCell>
              <TableCell>{`${item.dateTime.toLocaleDateString()} ${item.dateTime.toLocaleTimeString()}`}</TableCell>
              <TableCell>{item.type}</TableCell>
              <TableCell>{item.direction}</TableCell>
              <TableCell>{item.marketId}</TableCell>
              <TableCell>
                {item.price.value} {item.price.currencyId}
              </TableCell>
              <TableCell>{item.priceUnit}</TableCell>
              <TableCell>
                {item.volume.value} {item.volume.unit}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
