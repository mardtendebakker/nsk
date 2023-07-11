import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Pagination,
  Checkbox,
} from '@mui/material';
import useTranslation from '../../../../hooks/useTranslation';
import { UserListItem } from '../../../../utils/axios/models/user';

export default function List({
  users = [],
  count,
  page,
  onPageChange,
  onCheck,
  disabled,
}: {
  users: UserListItem[],
  count: number,
  page: number,
  onPageChange: (newPage: number)=>void,
  onCheck: (object: { id: number, checked: boolean })=>void,
  disabled: boolean
}) {
  const { trans } = useTranslation();

  return (
    <>
      <Table>
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
                {user.UserCreateDate}
              </TableCell>
              <TableCell>
                {user.UserLastModifiedDate}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination
        disabled={disabled}
        sx={{ display: 'flex', justifyContent: 'end', mt: '2rem' }}
        shape="rounded"
        count={count}
        onChange={(_, newPage) => onPageChange(newPage)}
        page={page}
      />
    </>
  );
}
