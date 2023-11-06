import {
  Box,
  IconButton,
  Table,
  TableBody,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { format } from 'date-fns';
import Check from '@mui/icons-material/Check';
import ChevronRight from '@mui/icons-material/ChevronRight';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import useTranslation from '../../../../hooks/useTranslation';
import { UserListItem } from '../../../../utils/axios/models/user';
import TableCell from '../../../tableCell';
import Select from '../../../input/select';
import Edit from '../../../button/edit';
import Can from '../../../can';

export default function List({
  users = [],
  hasNextPage,
  hasPreviousPage,
  onGoNext,
  onGoPrevious,
  onRowsPerPageChange,
  rowsPerPage,
  count,
  disabled,
  onEdit,
}: {
  users: UserListItem[],
  hasNextPage: boolean,
  hasPreviousPage: boolean,
  onGoNext: () => void,
  onGoPrevious: () => void,
  onRowsPerPageChange: (rowsPerPage: number)=>void,
  rowsPerPage: number,
  count,
  disabled: boolean,
  onEdit: (username: string) => void
}) {
  const { trans } = useTranslation();

  return (
    <Box sx={{ width: '100%', overflowX: 'scroll' }}>
      <Table size="small">
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
            <TableCell>
              {trans('actions')}
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
              <TableCell>
                <Can requiredGroups={['super_admin']} disableDefaultGroups>
                  <Edit onClick={() => onEdit(user.Username)} disabled={disabled} />
                </Can>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Box sx={{
        display: 'flex', justifyContent: 'flex-end', alignItems: ' center', mt: '2rem',
      }}
      >
        <Typography variant="body2" sx={{ mr: '1.5rem' }}>
          {trans('rowsPerPage')}
        </Typography>
        <Select
          sx={{ mr: '1.5rem' }}
          variant="standard"
          value={rowsPerPage}
          onChange={(e) => onRowsPerPageChange(parseInt(e.target.value, 10))}
          options={[
            { title: '5', value: 5 },
            { title: '10', value: 10 },
            { title: '25', value: 25 },
            { title: '50', value: 50 },
          ]}
        />
        <Typography variant="body2" sx={{ mr: '1.5rem' }}>
          {count}
          {' '}
          {trans('users')}
        </Typography>
        <IconButton onClick={onGoPrevious} disabled={!hasPreviousPage || disabled}><ChevronLeft /></IconButton>
        <IconButton onClick={onGoNext} disabled={!hasNextPage || disabled}><ChevronRight /></IconButton>
      </Box>
    </Box>
  );
}
