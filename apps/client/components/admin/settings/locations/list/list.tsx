import {
  TableBody, TableHead, TableRow,
} from '@mui/material';
import PaginatedTable from '../../../../paginatedTable';
import TableCell from '../../../../tableCell';
import Edit from '../../../../button/edit';
import { Location } from '../../../../../utils/axios/models/location';
import useTranslation from '../../../../../hooks/useTranslation';

export default function List({
  locations,
  onEdit,
  disabled,
  count,
  page,
  onPageChange,
  onRowsPerPageChange,
  rowsPerPage,
}: {
  onEdit: (id: number) => void,
  locations: Location[],
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
            {trans('zipcodes')}
          </TableCell>
          <TableCell>
            {trans('actions')}
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {locations.map((location: Location) => (
          <TableRow key={location.id}>
            <TableCell>
              {location.name}
            </TableCell>
            <TableCell>
              {location.zipcodes}
            </TableCell>
            <TableCell>
              <Edit onClick={() => onEdit(location.id)} disabled={disabled} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </PaginatedTable>
  );
}
