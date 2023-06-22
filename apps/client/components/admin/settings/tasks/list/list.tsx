import {
  Table, TableBody, TableCell, TableHead, TableRow, Pagination,
} from '@mui/material';
import Edit from '../../../../button/edit';
import { Task } from '../../../../../utils/axios/models/product';
import useTranslation from '../../../../../hooks/useTranslation';

export default function List({
  tasks,
  onEdit,
  disabled,
  count,
  onPageChange,
  page,
}: {
  onEdit: (id: number) => void,
  tasks: Task[],
  count: number,
  page: number,
  onPageChange: (newPage: number)=>void,
  disabled: boolean
}) {
  const { trans } = useTranslation();

  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              {trans('id')}
            </TableCell>
            <TableCell>
              {trans('name')}
            </TableCell>
            <TableCell>
              {trans('description')}
            </TableCell>
            <TableCell>
              {trans('numberOfProductTypes')}
            </TableCell>
            <TableCell>
              {trans('actions')}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tasks.map((task: Task) => (
            <TableRow key={task.id}>
              <TableCell>
                {task.id}
              </TableCell>
              <TableCell>
                {task.name}
              </TableCell>
              <TableCell>
                {task.description || '--'}
              </TableCell>
              <TableCell>
                {task.productTypes?.length || 0}
              </TableCell>
              <TableCell>
                <Edit onClick={() => onEdit(task.id)} disabled={disabled} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination
        sx={{ display: 'flex', justifyContent: 'end', mt: '2rem' }}
        shape="rounded"
        count={count}
        onChange={(_, newPage) => onPageChange(newPage)}
        page={page}
      />
    </>
  );
}
