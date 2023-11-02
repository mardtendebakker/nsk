import { Box, Table, TablePagination } from '@mui/material';
import useTranslation from '../hooks/useTranslation';

export default function PaginatedTable({
  children,
  onPageChange,
  onRowsPerPageChange,
  page,
  rowsPerPage,
  count,
  disabled,
}: {
  children: any,
  onPageChange: (arg0: number) => void,
  onRowsPerPageChange: (arg0: number) => void,
  page: number,
  rowsPerPage: number,
  count: number,
  disabled?: boolean,
}) {
  const currentPage = count > 0 ? page - 1 : 0;
  const { trans } = useTranslation();

  return (
    <Box sx={{ width: '100%', overflowX: 'scroll' }}>
      <Table size="small">{children}</Table>
      <TablePagination
        labelRowsPerPage={trans('rowsPerPage')}
        size="small"
        component="div"
        sx={{
          display: 'flex', justifyContent: 'end', mt: '2rem', overflow: 'hidden',
        }}
        count={count}
        onPageChange={(_, newPage) => {
          if (!disabled) {
            onPageChange(newPage + 1);
          }
        }}
        page={currentPage}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25, 50]}
        onRowsPerPageChange={(e) => {
          if (!disabled) {
            onRowsPerPageChange(parseInt(e.target.value, 10));
          }
        }}
      />
    </Box>
  );
}

PaginatedTable.defaultProps = { disabled: false };
