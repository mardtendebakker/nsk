import {
  TableBody, TableHead, TableRow,
} from '@mui/material';
import PaginatedTable from '../../../../paginatedTable';
import TableCell from '../../../../tableCell';
import Edit from '../../../../button/edit';
import { Driver } from '../../../../../utils/axios/models/logistic';
import useTranslation from '../../../../../hooks/useTranslation';
import DeleteResource from '../../../../button/deleteResource';

export default function List({
  drivers,
  onEdit,
  onDelete,
  disabled,
  count,
  page,
  onPageChange,
  onRowsPerPageChange,
  rowsPerPage,
}: {
  onEdit: (id: number) => void,
  onDelete: (id: number) => void,
  drivers: Driver[],
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
            {trans('firstName')}
          </TableCell>
          <TableCell>
            {trans('lastName')}
          </TableCell>
          <TableCell>
            {trans('username')}
          </TableCell>
          <TableCell>
            {trans('email')}
          </TableCell>
          <TableCell align="right">
            {trans('actions')}
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {drivers.map((driver: Driver) => (
          <TableRow key={driver.id}>
            <TableCell>
              {driver.first_name}
            </TableCell>
            <TableCell>
              {driver.last_name}
            </TableCell>
            <TableCell>
              {driver.username}
            </TableCell>
            <TableCell>
              {driver.email}
            </TableCell>
            <TableCell align="right">
              <Edit onClick={() => onEdit(driver.id)} disabled={disabled} />
              <DeleteResource onClick={() => onDelete(driver.id)} disabled={disabled} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </PaginatedTable>
  );
}
