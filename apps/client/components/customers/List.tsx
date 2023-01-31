import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
} from '@mui/material';
import { trans } from 'itranslator';
import { Customer } from '../../utils/axios';

function CustomersList({
  customers = [],
  count,
  page,
  rowsPerPage,
  onPageChange,
}: {
  customers: Customer[],
  count: number,
  page: number,
  rowsPerPage: number,
  onPageChange: (newPage: number)=>void
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
                {trans('isPartner')}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.map((customer: Customer) => (
              <TableRow
                sx={{
                  height: 60,
                }}
                hover
                key={customer.id}
              >
                <TableCell>
                  {customer.id}
                </TableCell>
                <TableCell>
                  {customer.name}
                </TableCell>
                <TableCell>
                  {customer.representative}
                </TableCell>
                <TableCell>
                  {Boolean(customer.is_partner)}
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

export default CustomersList;
