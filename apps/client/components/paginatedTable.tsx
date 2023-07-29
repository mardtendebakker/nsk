import { Table, TablePagination } from '@mui/material';

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
  return (
    <>
      <Table size="small">{children}</Table>
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
        rowsPerPageOptions={[5, 10, 25, 50]}
        onRowsPerPageChange={(e) => {
          if (!disabled) {
            onRowsPerPageChange(parseInt(e.target.value, 10));
          }
        }}
      />
    </>
  );
}

PaginatedTable.defaultProps = { disabled: false };
