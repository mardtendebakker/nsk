import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  Pagination,
  TableRow,
  Checkbox,
} from '@mui/material';
import moment from 'moment';
import useTranslation from '../../../../hooks/useTranslation';
import { SalesOrder } from '../../../../utils/axios';

export default function List({
  salesOrders = [],
  count,
  page,
  onPageChanged,
  onChecked,
}: {
  salesOrders: SalesOrder[],
  count: number,
  page: number,
  onPageChanged: (newPage: number)=>void,
  onChecked: (object: { id: number, checked: boolean })=>void,
}) {
  const { trans } = useTranslation();

  return (
    <Card sx={{ overflowX: 'auto', p: '1.5rem' }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              {trans('orderNumber')}
            </TableCell>
            <TableCell>
              {trans('orderDate')}
              {' '}
              (yy/mm/dd)
            </TableCell>
            <TableCell>
              {trans('customer')}
            </TableCell>
            <TableCell>
              {trans('partner')}
            </TableCell>
            <TableCell>
              {trans('status')}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {salesOrders.map((salesOrder: SalesOrder) => (
            <TableRow
              sx={{
                height: 60,
              }}
              hover
              key={salesOrder.id}
            >
              <TableCell>
                <Checkbox sx={{ mr: '1.5rem' }} onChange={(_, checked) => { onChecked({ id: salesOrder.id, checked }); }} />
                {salesOrder.order_nr}
              </TableCell>
              <TableCell>
                {moment(salesOrder.order_date).format('Y/MM/DD')}
              </TableCell>
              <TableCell>
                {salesOrder.order_nr}
              </TableCell>
              <TableCell>
                {salesOrder.order_nr}
              </TableCell>
              <TableCell>
                status
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination
        sx={{ display: 'flex', justifyContent: 'end', mt: '2rem' }}
        shape="rounded"
        count={count}
        onChange={(_, newPage) => onPageChanged(newPage)}
        page={page}
      />
    </Card>
  );
}
