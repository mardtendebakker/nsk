import {
  TableBody,
  TableHead,
  TableRow,
} from '@mui/material';
import useTranslation from '../../../hooks/useTranslation';
import PaginatedTable from '../../paginatedTable';
import TableCell from '../../tableCell';

export default function List({
  emails = [],
  count,
  page,
  onPageChange,
  onRowsPerPageChange,
  rowsPerPage,
  onCheck,
  disabled,
}: {
  emails: any[],
  count: number,
  page: number,
  onPageChange: (newPage: number)=>void,
  onRowsPerPageChange: (rowsPerPage: number)=>void,
  rowsPerPage: number,
  onCheck: (object: { id: number, checked: boolean })=>void,
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
            {trans('recipients')}
          </TableCell>
          <TableCell>
            {trans('openRate')}
          </TableCell>
          <TableCell>
            {trans('clickRate')}
          </TableCell>
          <TableCell>
            {trans('unsubscribes')}
          </TableCell>
          <TableCell>
            {trans('status')}
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody />
    </PaginatedTable>
  );
}
