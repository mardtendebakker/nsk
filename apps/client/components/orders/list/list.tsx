import {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Checkbox,
  Box,
} from '@mui/material';
import { useRouter } from 'next/router';
import { format } from 'date-fns';
import { ORDERS_PURCHASES } from '../../../utils/routes';
import useTranslation from '../../../hooks/useTranslation';
import { OrderListItem } from '../../../utils/axios/models/order';
import PaginatedTable from '../../paginatedTable';

export default function List({
  orders = [],
  checkedOrderIds = [],
  count,
  page,
  onPageChange,
  onRowsPerPageChange,
  rowsPerPage,
  onCheck,
  disabled,
}: {
  orders: OrderListItem[],
  checkedOrderIds: number[],
  count: number,
  page: number,
  onPageChange: (newPage: number)=>void,
  onRowsPerPageChange: (rowsPerPage: number)=>void,
  rowsPerPage: number,
  onCheck: (object: { id: number, checked: boolean })=>void,
  disabled: boolean
}) {
  const { trans } = useTranslation();
  const router = useRouter();

  return (
    <PaginatedTable
      count={count}
      page={page}
      onPageChange={onPageChange}
      onRowsPerPageChange={onRowsPerPageChange}
      rowsPerPage={rowsPerPage}
      disabled={disabled}
    >
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
        {orders.map((order: OrderListItem) => (
          <TableRow
            sx={{
              height: 60,
            }}
            hover
            key={order.id}
          >
            <TableCell>
              <Checkbox
                disabled={disabled}
                checked={Boolean(checkedOrderIds.find((id) => id === order.id))}
                sx={{ mr: '1.5rem' }}
                onChange={(_, checked) => { onCheck({ id: order.id, checked }); }}
              />
              {order.order_nr}
            </TableCell>
            <TableCell>
              {format(new Date(order.order_date), 'yyyy/MM/dd')}
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
                  fontWeight: (theme) => theme.typography.fontWeightMedium,
                }}
                >
                  {order.order_status.name}
                </Box>
              </Box>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </PaginatedTable>
  );
}
