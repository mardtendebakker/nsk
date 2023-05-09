import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  Pagination,
  TableRow,
  Checkbox,
  Box,
} from '@mui/material';
import moment from 'moment';
import { useRouter } from 'next/router';
import { ORDERS_PURCHASES } from '../../../utils/routes';
import useTranslation from '../../../hooks/useTranslation';
import { Order } from '../../../utils/axios';

export default function List({
  orders = [],
  checkedOrderIds = [],
  count,
  page,
  onPageChanged,
  onChecked,
}: {
  orders: Order[],
  checkedOrderIds: number[],
  count: number,
  page: number,
  onPageChanged: (newPage: number)=>void,
  onChecked: (object: { id: number, checked: boolean })=>void,
}) {
  const { trans } = useTranslation();
  const router = useRouter();

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
              {trans(router.pathname == ORDERS_PURCHASES ? 'supplier' : 'customer')}
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
          {orders.map((order: Order) => (
            <TableRow
              sx={{
                height: 60,
              }}
              hover
              key={order.id}
            >
              <TableCell>
                <Checkbox
                  checked={Boolean(checkedOrderIds.find((id) => id === order.id))}
                  sx={{ mr: '1.5rem' }}
                  onChange={(_, checked) => { onChecked({ id: order.id, checked }); }}
                />
                {order.order_nr}
              </TableCell>
              <TableCell>
                {moment(order.order_date).format('Y/MM/DD')}
              </TableCell>
              <TableCell>
                {(router.pathname == ORDERS_PURCHASES
                  ? order.acompany_aorder_supplier_idToacompany?.name
                  : order.acompany_aorder_customer_idToacompany?.name) || '--'}
              </TableCell>
              <TableCell>
                {(router.pathname == ORDERS_PURCHASES
                  ? order.acompany_aorder_supplier_idToacompany?.acompany?.name
                  : order.acompany_aorder_customer_idToacompany?.acompany?.name) || '--'}
              </TableCell>
              <TableCell>
                <Box>
                  <Box sx={{
                    px: '1rem',
                    py: '.5rem',
                    bgcolor: `${order.order_status.color}25`,
                    color: order.order_status.color,
                    borderRadius: '.3rem',
                    width: 'fit-content',
                    fontWeight: 500,
                  }}
                  >
                    {order.order_status.name}
                  </Box>
                </Box>
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
