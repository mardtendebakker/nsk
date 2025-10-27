import {
  TableBody, TableHead, TableRow,
} from '@mui/material';
import { format } from 'date-fns';
import PaginatedTable from '../../../paginatedTable';
import TableCell from '../../../tableCell';
import useTranslation from '../../../../hooks/useTranslation';
import { ActivityLog } from '../../../../utils/axios/models/activityLog';

export default function List({
  activityLogs,
  disabled,
  count,
  page,
  onPageChange,
  onRowsPerPageChange,
  rowsPerPage,
}: {
  activityLogs: ActivityLog[],
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
            {trans('username')}
          </TableCell>
          <TableCell>
            {trans('method')}
          </TableCell>
          <TableCell>
            {trans('route')}
          </TableCell>
          <TableCell>
            {trans('model')}
          </TableCell>
          <TableCell>
            {trans('action')}
          </TableCell>
          <TableCell>
            {trans('params')}
          </TableCell>
          <TableCell>
            {trans('body')}
          </TableCell>
          <TableCell>
            {trans('createdAt')}
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {activityLogs.map((activityLog: ActivityLog) => (
          <TableRow key={activityLog.id}>
            <TableCell>
              {activityLog.username}
            </TableCell>
            <TableCell>
              {activityLog.method}
            </TableCell>
            <TableCell>
              {activityLog.route}
            </TableCell>
            <TableCell>
              {activityLog.model}
            </TableCell>
            <TableCell>
              {activityLog.action}
            </TableCell>
            <TableCell>
              {activityLog.params ? (
                <div style={{
                  maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}
                >
                  {activityLog.params}
                </div>
              ) : null}
            </TableCell>
            <TableCell>
              {activityLog.body ? (
                <div style={{
                  maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}
                >
                  {activityLog.body}
                </div>
              ) : null}
            </TableCell>
            <TableCell>
              {format(new Date(activityLog.createdAt), 'yyyy/MM/dd HH:mm')}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </PaginatedTable>
  );
}
