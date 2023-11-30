import {
  TableBody,
  TableHead,
  TableRow,
  Checkbox,
  Box,
  Tooltip,
} from '@mui/material';
import { format } from 'date-fns';
import Link from 'next/link';
import useTranslation from '../../../hooks/useTranslation';
import { SubContact, Contact as ContactModel, OrderListItem } from '../../../utils/axios/models/order';
import PaginatedTable from '../../paginatedTable';
import TableCell from '../../tableCell';
import Delete from '../../button/delete';
import Edit from '../../button/edit';
import {
  CONTACTS_CUSTOMERS_EDIT, CONTACTS_SUPPLIERS_EDIT, ORDERS_PURCHASES_EDIT, ORDERS_REPAIRS_EDIT, ORDERS_SALES_EDIT,
} from '../../../utils/routes';
import { OrderType } from '../../../utils/axios/models/types';
import Can from '../../can';

const EDIT_PATHS = {
  purchase: ORDERS_PURCHASES_EDIT,
  sales: ORDERS_SALES_EDIT,
  repair: ORDERS_REPAIRS_EDIT,
};

function OrderNumber({ order, type }: { order: OrderListItem, type: OrderType }) {
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

  const TARGETS = {
    purchase: ORDERS_PURCHASES_EDIT,
    repair: ORDERS_REPAIRS_EDIT,
    sales: ORDERS_SALES_EDIT,
  };

  return (
    <Tooltip title={productsTooltip ? (
      <Box sx={{ whiteSpace: 'pre' }}>
        {productsTooltip}
      </Box>
    ) : undefined}
    >
      <Box sx={{ textDecoration: productsTooltip ? 'underline' : undefined, display: 'inline' }}>
        <Link href={TARGETS[type].replace('[id]', order.id.toString())} style={{ color: 'inherit' }}>
          {order.order_nr}
        </Link>
      </Box>
    </Tooltip>
  );
}

function Contact({ contact, type }: { contact: ContactModel, type: OrderType }) {
  let tooltip = '';

  if (contact?.street) {
    tooltip += `${contact?.street}\n`;
  }

  if (contact?.zip) {
    tooltip += `${contact?.zip} `;
  }

  if (contact?.city) {
    tooltip += contact.city;
  }

  const target = type === 'purchase' ? CONTACTS_SUPPLIERS_EDIT : CONTACTS_CUSTOMERS_EDIT;

  return (
    <Tooltip title={tooltip ? (
      <Box sx={{ whiteSpace: 'pre' }}>
        {tooltip}
      </Box>
    ) : undefined}
    >
      <Link href={target.replace('[id]', contact?.id)} style={{ color: 'unset' }}>
        {`${contact?.name} - ${contact?.company_name}` || '--'}
      </Link>
    </Tooltip>
  );
}

function Partner({ partner }: { partner: SubContact }) {
  let tooltip = '';

  if (partner?.street) {
    tooltip += `${partner?.street}\n`;
  }

  if (partner?.zip) {
    tooltip += `${partner?.zip} `;
  }

  if (partner?.city) {
    tooltip += partner.city;
  }

  return (
    <Tooltip title={tooltip ? (
      <Box sx={{ whiteSpace: 'pre' }}>
        {tooltip}
      </Box>
    ) : undefined}
    >
      <Link href={CONTACTS_CUSTOMERS_EDIT.replace('[id]', partner.id)} style={{ color: 'unset' }}>
        {`${partner?.name} - ${partner?.company_name}` || '--'}
      </Link>
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
  onDelete,
}: {
  type: OrderType,
  orders: OrderListItem[],
  checkedOrderIds: number[],
  count: number,
  page: number,
  onPageChange: (newPage: number)=>void,
  onRowsPerPageChange: (rowsPerPage: number)=>void,
  rowsPerPage: number,
  onCheck: (object: { id: number, checked: boolean })=>void,
  disabled: boolean,
  onDelete: (id: number) => void,
}) {
  const { trans } = useTranslation();
  const editPath = EDIT_PATHS[type] || ORDERS_PURCHASES_EDIT;

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
            {trans(type === 'purchase' ? 'pickupDate' : 'deliveryDate')}
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
          const contact = type === 'purchase' ? order.contact_aorder_supplier_idTocontact : order.contact_aorder_customer_idTocontact;
          const deliveryOrPickupDate = type === 'purchase'
            ? order?.pickup?.real_pickup_date
            : order.delivery_date;

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
                <OrderNumber order={order} type={type} />
              </TableCell>
              <TableCell>
                {format(new Date(order.order_date), 'yyyy/MM/dd')}
              </TableCell>
              <TableCell>
                {deliveryOrPickupDate ? format(
                  new Date(deliveryOrPickupDate),
                  'yyyy/MM/dd',
                ) : '--'}
              </TableCell>
              <TableCell>
                <Contact contact={contact} type={type} />
              </TableCell>
              <TableCell>
                { contact?.contact && <Partner partner={contact.contact} /> }
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
                <Edit href={editPath.replace('[id]', order.id.toString())} disabled={disabled} />
                <Can requiredGroups={['admin', 'super_admin', 'manager', 'logistics', 'local']}>
                  <Delete onClick={() => onDelete(order.id)} disabled={disabled} tooltip />
                </Can>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </PaginatedTable>
  );
}
