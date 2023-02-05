import {
  Box,
  Card,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
} from '@mui/material';
import Edit from '@mui/icons-material/Edit';
import { trans } from 'itranslator';
import { Supplier } from '../../utils/axios';

function SuppliersList({
  suppliers = [],
  count,
  page,
  rowsPerPage,
  onPageChange,
  onEdit,

}: {
  suppliers: Supplier[],
  count: number,
  page: number,
  rowsPerPage: number,
  onPageChange: (newPage: number)=>void,
  onEdit: (id: number) => void
}) {
  return (
    <Card sx={{ overflowX: 'auto' }}>
      <Box sx={{ minWidth: 1050 }}>
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
                {trans('representative')}
              </TableCell>
              <TableCell>
                {trans('email')}
              </TableCell>
              <TableCell>
                {trans('partner')}
              </TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {suppliers.map((supplier: Supplier) => (
              <TableRow
                sx={{
                  height: 60,
                }}
                hover
                key={supplier.id}
              >
                <TableCell>
                  {supplier.id}
                </TableCell>
                <TableCell>
                  {supplier.name}
                </TableCell>
                <TableCell>
                  {supplier.representative}
                </TableCell>
                <TableCell>
                  {supplier.email}
                </TableCell>
                <TableCell>
                  {supplier.partner}
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => onEdit(supplier.id)}>
                    <Edit />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
      <TablePagination
        component="div"
        count={count}
        onPageChange={(_, newPage) => onPageChange(newPage)}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[]}
      />
    </Card>
  );
}

export default SuppliersList;
