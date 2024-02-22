import {
  TableBody, TableHead, TableRow,
} from '@mui/material';
import PaginatedTable from '../../../../paginatedTable';
import TableCell from '../../../../tableCell';
import { Task } from '../../../../../utils/axios/models/product';
import useTranslation from '../../../../../hooks/useTranslation';
import EditResource from '../../../../button/editResource';

export default function List({
  tasks,
  onEdit,
  disabled,
  count,
  page,
  onPageChange,
  onRowsPerPageChange,
  rowsPerPage,
}: {
  onEdit: (id: number) => void,
  tasks: Task[],
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
            {trans('description')}
          </TableCell>
          <TableCell>
            {trans('numberOfProductTypes')}
          </TableCell>
          <TableCell align="right">
            {trans('actions')}
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {tasks.map((task: Task) => (
          <TableRow key={task.id}>
            <TableCell>
              {task.name}
            </TableCell>
            <TableCell>
              {task.description}
            </TableCell>
            <TableCell>
              {task.productTypes?.length || 0}
            </TableCell>
            <TableCell align="right">
              <EditResource onClick={() => onEdit(task.id)} disabled={disabled} requiredModule="tasks" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </PaginatedTable>
  );
}
