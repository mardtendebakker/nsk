import {
  TableBody, TableHead, TableRow,
} from '@mui/material';
import PaginatedTable from '../../../../paginatedTable';
import TableCell from '../../../../tableCell';
import Edit from '../../../../button/edit';
import { Vehicle } from '../../../../../utils/axios/models/logistic';
import useTranslation from '../../../../../hooks/useTranslation';
import DeleteResource from '../../../../button/deleteResource';

export default function List({
  vehicles,
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
  vehicles: Vehicle[],
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
            {trans('registrationNumber')}
          </TableCell>
          <TableCell align="right">
            {trans('actions')}
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {vehicles.map((vehicle: Vehicle) => (
          <TableRow key={vehicle.id}>
            <TableCell>
              {vehicle.name}
            </TableCell>
            <TableCell>
              {vehicle.registration_number}
            </TableCell>
            <TableCell align="right">
              <Edit onClick={() => onEdit(vehicle.id)} disabled={disabled} />
              <DeleteResource onClick={() => onDelete(vehicle.id)} disabled={disabled} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </PaginatedTable>
  );
}
