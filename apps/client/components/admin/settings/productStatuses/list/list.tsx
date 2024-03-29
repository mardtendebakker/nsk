import {
  TableBody, TableHead, TableRow, Box,
} from '@mui/material';
import Check from '@mui/icons-material/Check';
import { ProductStatus } from '../../../../../utils/axios/models/product';
import useTranslation from '../../../../../hooks/useTranslation';
import PaginatedTable from '../../../../paginatedTable';
import TableCell from '../../../../tableCell';
import EditResource from '../../../../button/editResource';

export default function List({
  productStatuses,
  onEdit,
  disabled,
  count,
  page,
  onPageChange,
  onRowsPerPageChange,
  rowsPerPage,
}: {
  onEdit: (id: number) => void,
  productStatuses: ProductStatus[],
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
            {trans('saleable')}
          </TableCell>
          <TableCell>
            {trans('stock')}
          </TableCell>
          <TableCell align="right">
            {trans('actions')}
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {productStatuses.map((productStatus: ProductStatus) => (
          <TableRow key={productStatus.id}>
            <TableCell>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {productStatus.name}
                <Box sx={{
                  bgcolor: productStatus.color, width: '.7rem', height: '.7rem', borderRadius: '50%', ml: '.5rem',
                }}
                />
              </Box>
            </TableCell>
            <TableCell>
              {productStatus.is_saleable && <Check />}
            </TableCell>
            <TableCell>
              {productStatus.is_stock && <Check />}
            </TableCell>
            <TableCell align="right">
              <EditResource onClick={() => onEdit(productStatus.id)} disabled={disabled} requiredModule="product_statuses" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </PaginatedTable>
  );
}
