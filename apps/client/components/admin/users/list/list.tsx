import {
  Table,
  TableBody,
  TableHead,
  TablePagination,
  TableRow,
} from '@mui/material';
import { format } from 'date-fns';
import Check from '@mui/icons-material/Check';
import useTranslation from '../../../../hooks/useTranslation';
import { UserListItem } from '../../../../utils/axios/models/user';
import TableCell from '../../../tableCell';
import Edit from '../../../button/edit';
import Can from '../../../can';

export default function List({
  users = [],
  onEdit,
  count,
  page,
  onPageChange,
  onRowsPerPageChange,
  rowsPerPage,
  disabled,
}: {
  users: UserListItem[],
  onEdit: (user: UserListItem)=>void,
  count: number,
  page: number,
  onPageChange: (newPage: number)=>void,
  onRowsPerPageChange: (rowsPerPage: number)=>void,
  rowsPerPage: number,
  disabled: boolean
}) {
  const { trans } = useTranslation();

  return (
    <>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>
              {trans('username')}
            </TableCell>
            <TableCell>
              {trans('email')}
            </TableCell>
            <TableCell>
              {trans('emailVerified')}
            </TableCell>
            <TableCell>
              {trans('createdAt')}
            </TableCell>
            <TableCell>
              {trans('updatedAt')}
            </TableCell>
            <TableCell align="right">
              {trans('actions')}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>

          {users.map((user: UserListItem) => (
            <TableRow key={user.id}>
              <TableCell>
                {user.username}
              </TableCell>
              <TableCell>
                {user.email}
              </TableCell>
              <TableCell>
                {user.emailVerified && <Check />}
              </TableCell>
              <TableCell>
                {format(new Date(user.createdAt), 'yyyy/MM/dd')}
              </TableCell>
              <TableCell>
                {format(new Date(user.updatedAt), 'yyyy/MM/dd')}
              </TableCell>
              <TableCell align="right">
                <Can requiredGroups={['super_admin']}>
                  <Edit onClick={() => onEdit(user)} disabled={disabled} />
                </Can>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        size="small"
        component="div"
        sx={{ display: 'flex', justifyContent: 'end', mt: '2rem' }}
        count={count}
        onPageChange={(_, newPage) => {
          if (!disabled) {
            onPageChange(newPage + 1);
          }
        }}
        page={page - 1}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[10, 25, 50]}
        onRowsPerPageChange={(e) => {
          if (!disabled) {
            onRowsPerPageChange(parseInt(e.target.value, 10));
          }
        }}
      />
    </>
  );
}
