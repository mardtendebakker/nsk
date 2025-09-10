import {
  TableBody, TableHead, TableRow,
} from '@mui/material';
import { format } from 'date-fns';
import { Check } from '@mui/icons-material';
import PaginatedTable from '../../../paginatedTable';
import TableCell from '../../../tableCell';
import useTranslation from '../../../../hooks/useTranslation';
import { EmailLog } from '../../../../utils/axios/models/emailLog';

export default function List({
  emailLogs,
  disabled,
  count,
  page,
  onPageChange,
  onRowsPerPageChange,
  rowsPerPage,
}: {
  emailLogs: EmailLog[],
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
            {trans('from')}
          </TableCell>
          <TableCell>
            {trans('to')}
          </TableCell>
          <TableCell>
            {trans('subject')}
          </TableCell>
          <TableCell>
            {trans('content')}
          </TableCell>
          <TableCell>
            {trans('apiError')}
          </TableCell>
          <TableCell>
            {trans('successful')}
          </TableCell>
          <TableCell>
            {trans('createdAt')}
          </TableCell>
          <TableCell>
            {trans('updatedAt')}
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {emailLogs.map((emailLog: EmailLog) => (
          <TableRow key={emailLog.id}>
            <TableCell>
              {emailLog.from}
            </TableCell>
            <TableCell>
              {emailLog.to}
            </TableCell>
            <TableCell>
              {emailLog.subject}
            </TableCell>
            <TableCell>
              {emailLog.content}
            </TableCell>
            <TableCell>
              {emailLog.api_error}
            </TableCell>
            <TableCell>
              {emailLog.successful ? <Check /> : ''}
            </TableCell>
            <TableCell>
              {format(new Date(emailLog.created_at), 'yyyy/MM/dd HH:mm')}
            </TableCell>
            <TableCell>
              {format(new Date(emailLog.updated_at), 'yyyy/MM/dd HH:mm')}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </PaginatedTable>
  );
}
