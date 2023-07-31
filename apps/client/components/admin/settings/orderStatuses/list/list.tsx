import {
  TableBody, TableHead, TableRow, Box,
} from '@mui/material';
import Check from '@mui/icons-material/Check';
import Edit from '../../../../button/edit';
import { OrderStatus } from '../../../../../utils/axios/models/order';
import useTranslation from '../../../../../hooks/useTranslation';
import PaginatedTable from '../../../../paginatedTable';
import TableCell from '../../../../tableCell';

export default function List({
  orderStatuses,
  onEdit,
  disabled,
  count,
  page,
  onPageChange,
  onRowsPerPageChange,
  rowsPerPage,
}: {
  onEdit: (id: number) => void,
  orderStatuses: OrderStatus[],
  count: number,
  page: number,
  onPageChange: (newPage: number)=>void,
  onRowsPerPageChange: (rowsPerPage: number)=>void,
  rowsPerPage: number,
  disabled: boolean
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
            {trans('name')}
          </TableCell>
          <TableCell>
            {trans('sale')}
          </TableCell>
          <TableCell>
            {trans('purchase')}
          </TableCell>
          <TableCell>
            {trans('actions')}
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {orderStatuses.map((orderStatus: OrderStatus) => (
          <TableRow key={orderStatus.id}>
            <TableCell>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {orderStatus.name}
                <Box sx={{
                  bgcolor: orderStatus.color, width: '.7rem', height: '.7rem', borderRadius: '50%', ml: '.5rem',
                }}
                />
              </Box>
            </TableCell>
            <TableCell>
              {orderStatus.is_sale && <Check />}
            </TableCell>
            <TableCell>
              {orderStatus.is_purchase && <Check />}
            </TableCell>
            <TableCell>
              <Edit onClick={() => onEdit(orderStatus.id)} disabled={disabled} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </PaginatedTable>
  );
}
