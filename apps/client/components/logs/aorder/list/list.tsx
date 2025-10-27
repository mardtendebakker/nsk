import {
  TableBody, TableHead, TableRow, Box,
} from '@mui/material';
import { format } from 'date-fns';
import PaginatedTable from '../../../paginatedTable';
import TableCell from '../../../tableCell';
import useTranslation from '../../../../hooks/useTranslation';
import { AorderLog } from '../../../../utils/axios/models/aorderLog';

export default function List({
  aorderLogs,
  disabled,
  count,
  page,
  onPageChange,
  onRowsPerPageChange,
  rowsPerPage,
}: {
  aorderLogs: AorderLog[],
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
            {trans('previousStatus')}
          </TableCell>
          <TableCell>
            {trans('status')}
          </TableCell>
          <TableCell>
            {trans('createdAt')}
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {aorderLogs.map((aorderLog: AorderLog) => (
          <TableRow key={aorderLog.id}>
            <TableCell>
              {aorderLog.username}
            </TableCell>
            <TableCell>
              {aorderLog.previous_status && (
                <Box sx={{
                  px: '1rem',
                  py: '.5rem',
                  bgcolor: `${aorderLog.previous_status.color}25`,
                  color: aorderLog.previous_status.color,
                  borderRadius: '.3rem',
                  width: 'fit-content',
                  fontWeight: (theme) => theme.typography.fontWeightMedium,
                }}
                >
                  {aorderLog.previous_status.name}
                </Box>
              )}
            </TableCell>
            <TableCell>
              {aorderLog.status && (
                <Box sx={{
                  px: '1rem',
                  py: '.5rem',
                  bgcolor: `${aorderLog.status.color}25`,
                  color: aorderLog.status.color,
                  borderRadius: '.3rem',
                  width: 'fit-content',
                  fontWeight: (theme) => theme.typography.fontWeightMedium,
                }}
                >
                  {aorderLog.status.name}
                </Box>
              )}
            </TableCell>
            <TableCell>
              {format(new Date(aorderLog.created_at), 'yyyy/MM/dd HH:mm')}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </PaginatedTable>
  );
}
