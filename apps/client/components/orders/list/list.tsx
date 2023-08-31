import {
  TableBody,
  TableHead,
  TableRow,
  Checkbox,
  Box,
  Tooltip,
} from '@mui/material';
import { format } from 'date-fns';
import useTranslation from '../../../hooks/useTranslation';
import { Company as CompanyModel, OrderListItem } from '../../../utils/axios/models/order';
import PaginatedTable from '../../paginatedTable';
import TableCell from '../../tableCell';
import Delete from '../../button/delete';
import Edit from '../../button/edit';

function OrderNumber({ order }: { order: OrderListItem }) {
  let productsTooltip = '';

  for (let i = 0; i < 10; i++) {
    const productOrder = order?.product_orders[i];
    if (!productOrder) {
      break;
    }
    productsTooltip += `${productOrder.quantity}x `;
    productsTooltip += productOrder.product.name;
    productsTooltip += '\n';
  }

  return (
    <Tooltip title={productsTooltip ? (
      <Box sx={{ whiteSpace: 'pre' }}>
        {productsTooltip}
      </Box>
    ) : undefined}
    >
      <Box sx={{ textDecoration: productsTooltip ? 'underline' : undefined, display: 'inline' }}>
        {order.order_nr}
      </Box>
    </Tooltip>
  );
}

function Company({ company }: { company: CompanyModel }) {
  let tooltip = '';

  if (company.street) {
    tooltip += `${company?.street}\n`;
  }

  if (company.zip) {
    tooltip += `${company?.zip} `;
  }

  if (company.city) {
    tooltip += company.city;
  }

  return (
    <Tooltip title={tooltip ? (
      <Box sx={{ whiteSpace: 'pre' }}>
        {tooltip}
      </Box>
    ) : undefined}
    >
      <Box sx={{ textDecoration: tooltip ? 'underline' : undefined, display: 'inline' }}>
        {company?.name || '--'}
      </Box>
    </Tooltip>
  );
}

export default function List({
  type,
  orders = [],
  checkedOrderIds = [],
  count,
  page,
  onPageChange,
  onRowsPerPageChange,
  rowsPerPage,
  onCheck,
  disabled,
  onEdit,
  onDelete,
}: {
  type: 'purchase' | 'sales' | 'repair',
  orders: OrderListItem[],
  checkedOrderIds: number[],
  count: number,
  page: number,
  onPageChange: (newPage: number)=>void,
  onRowsPerPageChange: (rowsPerPage: number)=>void,
  rowsPerPage: number,
  onCheck: (object: { id: number, checked: boolean })=>void,
  disabled: boolean,
  onEdit: (id: number) => void,
  onDelete: (id: number) => void,
}) {
  const { trans } = useTranslation();

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
            {trans(type === 'purchase' ? 'supplier' : 'customer')}
          </TableCell>
          <TableCell>
            {trans('partner')}
          </TableCell>
          <TableCell>
            {trans('status')}
          </TableCell>
          <TableCell>
            {trans('actions')}
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {orders.map((order: OrderListItem) => {
          const company = type === 'purchase' ? order.acompany_aorder_supplier_idToacompany : order.acompany_aorder_customer_idToacompany;

          return (
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
                <OrderNumber order={order} />
              </TableCell>
              <TableCell>
                {format(new Date(order.order_date), 'yyyy/MM/dd')}
              </TableCell>
              <TableCell>
                <Company company={company} />
              </TableCell>
              <TableCell>
                {company?.acompany?.name || '--'}
              </TableCell>
              <TableCell>
                {order.order_status && (
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
                )}
              </TableCell>
              <TableCell>
                <Edit onClick={() => onEdit(order.id)} disabled={disabled} />
                <Delete onDelete={() => onDelete(order.id)} disabled={disabled} tooltip />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </PaginatedTable>
  );
}
