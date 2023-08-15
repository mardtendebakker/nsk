import {
  TableBody,
  TableHead,
  TableRow,
} from '@mui/material';
import { format } from 'date-fns';
import Check from '@mui/icons-material/Check';
import useTranslation from '../../../../hooks/useTranslation';
import { UserListItem } from '../../../../utils/axios/models/user';
import PaginatedTable from '../../../paginatedTable';
import TableCell from '../../../tableCell';

export default function List({
  users = [],
  count,
  page,
  onPageChange,
  onRowsPerPageChange,
  rowsPerPage,
  disabled,
}: {
  users: UserListItem[],
  count: number,
  page: number,
  onPageChange: (newPage: number)=>void,
  onRowsPerPageChange: (rowsPerPage: number)=>void,
  rowsPerPage: number,
  disabled: boolean,
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
            {trans('username')}
          </TableCell>
          <TableCell>
            {trans('status')}
          </TableCell>
          <TableCell>
            {trans('enabled')}
          </TableCell>
          <TableCell>
            {trans('createdAt')}
          </TableCell>
          <TableCell>
            {trans('lastModifiedAt')}
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {users.map((user: UserListItem) => (
          <TableRow key={user.Username}>
            <TableCell>
              {user.Username}
            </TableCell>
            <TableCell>
              {user.UserStatus}
            </TableCell>
            <TableCell>
              {user.Enabled && <Check />}
            </TableCell>
            <TableCell>
              {user.UserCreateDate && format(new Date(user.UserCreateDate), 'yyyy/MM/dd')}
            </TableCell>
            <TableCell>
              {user.UserLastModifiedDate && format(new Date(user.UserLastModifiedDate), 'yyyy/MM/dd')}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </PaginatedTable>
  );
}
