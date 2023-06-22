import {
  Table, TableBody, TableCell, TableHead, TableRow, Pagination, Box,
} from '@mui/material';
import Check from '@mui/icons-material/Check';
import Edit from '../../../../button/edit';
import { OrderStatus } from '../../../../../utils/axios/models/order';
import useTranslation from '../../../../../hooks/useTranslation';

export default function List({
  orderStatuses,
  onEdit,
  disabled,
  count,
  onPageChange,
  page,
}: {
  onEdit: (id: number) => void,
  orderStatuses: OrderStatus[],
  count: number,
  page: number,
  onPageChange: (newPage: number)=>void,
  disabled: boolean
}) {
  const { trans } = useTranslation();

  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              {trans('id')}
            </TableCell>
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
                {orderStatus.id}
              </TableCell>
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
      </Table>
      <Pagination
        sx={{ display: 'flex', justifyContent: 'end', mt: '2rem' }}
        shape="rounded"
        count={count}
        onChange={(_, newPage) => onPageChange(newPage)}
        page={page}
      />
    </>
  );
}
