import {
  TableBody, TableHead, TableRow,
} from '@mui/material';
import PaginatedTable from '../../../../paginatedTable';
import TableCell from '../../../../tableCell';
import { Team } from '../../../../../utils/axios/models/order';
import useTranslation from '../../../../../hooks/useTranslation';
import EditResource from '../../../../button/editResource';

export default function List({
  teams,
  disabled,
  count,
  page,
  onEdit,
  onPageChange,
  onRowsPerPageChange,
  rowsPerPage,
}: {
  teams: Team[],
  disabled: boolean,
  count: number,
  page: number,
  onEdit: (id: number) => void,
  onPageChange: (page: number) => void,
  onRowsPerPageChange: (rowsPerPage: number) => void,
  rowsPerPage: number,
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
            {trans('id')}
          </TableCell>
          <TableCell>
            {trans('name')}
          </TableCell>
          <TableCell align="right">
            {trans('actions')}
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {teams.map((team) => (
          <TableRow key={team.id}>
            <TableCell>
              {team.id}
            </TableCell>
            <TableCell>
              {team.name}
            </TableCell>
            <TableCell align="right">
              <EditResource onClick={() => onEdit(team.id)} disabled={disabled} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </PaginatedTable>
  );
}
