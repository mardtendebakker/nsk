import {
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
import { PurchaseOrder } from '../../../../utils/axios';

export default function List({
  purchaseOrders = [],
  count,
  page,
  onPageChanged,
  onChecked,
}: {
  purchaseOrders: PurchaseOrder[],
  count: number,
  page: number,
  onPageChanged: (newPage: number)=>void,
  onChecked: (object: { id: number, checked: boolean })=>void,
}) {
  const { trans } = useTranslation();

  return (
    <>
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
          {purchaseOrders.map((purchaseOrder: PurchaseOrder) => (
            <TableRow
              sx={{
                height: 60,
              }}
              hover
              key={purchaseOrder.id}
            >
              <TableCell>
                <Checkbox sx={{ mr: '1.5rem' }} onChange={(_, checked) => { onChecked({ id: purchaseOrder.id, checked }); }} />
                {purchaseOrder.order_nr}
              </TableCell>
              <TableCell>
                {moment(purchaseOrder.order_date).format('Y/MM/DD')}
              </TableCell>
              <TableCell>
                {purchaseOrder.order_nr}
              </TableCell>
              <TableCell>
                {purchaseOrder.order_nr}
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
    </>
  );
}
