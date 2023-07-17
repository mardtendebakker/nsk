import {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import moment from 'moment';
import useTranslation from '../../../../hooks/useTranslation';
import { UserListItem } from '../../../../utils/axios/models/user';
import PaginatedTable from '../../../paginatedTable';

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
              {user.Enabled ? 'True' : 'False'}
            </TableCell>
            <TableCell>
              {moment(user.UserCreateDate).format('Y/MM/DD')}
            </TableCell>
            <TableCell>
              {moment(user.UserLastModifiedDate).format('Y/MM/DD')}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </PaginatedTable>
  );
}
