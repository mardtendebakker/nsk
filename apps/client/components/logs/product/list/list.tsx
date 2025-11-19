import { TableBody, TableHead, TableRow } from '@mui/material';
import { format } from 'date-fns';
import PaginatedTable from '../../../paginatedTable';
import TableCell from '../../../tableCell';
import useTranslation from '../../../../hooks/useTranslation';
import { ProductLog } from '../../../../utils/axios/models/productLog';

export default function List({
  productLogs,
  disabled,
  count,
  page,
  onPageChange,
  onRowsPerPageChange,
  rowsPerPage,
}: {
  productLogs: ProductLog[];
  count: number;
  page: number;
  onPageChange: (newPage: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
  rowsPerPage: number;
  disabled: boolean;
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
          <TableCell>{trans('Atr.nr')}</TableCell>
          <TableCell>{trans('name')}</TableCell>
          <TableCell>{trans('sku')}</TableCell>
          <TableCell>{trans('orderNr')}</TableCell>
          <TableCell>{trans('action')}</TableCell>
          <TableCell>{trans('createdAt')}</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {productLogs.map((productLog: ProductLog) => (
          <TableRow key={productLog.id}>
            <TableCell>{productLog.product_id}</TableCell>
            <TableCell>{productLog.name}</TableCell>
            <TableCell>{productLog.sku}</TableCell>
            <TableCell>{productLog.order_nr}</TableCell>
            <TableCell>{productLog.action}</TableCell>
            <TableCell>
              {format(new Date(productLog.created_at), 'yyyy/MM/dd HH:mm')}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </PaginatedTable>
  );
}

