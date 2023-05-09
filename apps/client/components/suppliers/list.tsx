import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  Pagination,
  TableRow,
  Checkbox,
} from '@mui/material';
import { trans } from 'itranslator';
import { Supplier } from '../../utils/axios';

function SuppliersList({
  suppliers = [],
  count,
  page,
  onPageChange,
  onCheck,

}: {
  suppliers: Supplier[],
  count: number,
  page: number,
  onPageChange: (newPage: number)=>void,
  onCheck: (object: { id: number, checked: boolean })=>void,
}) {
  return (
    <Card sx={{ overflowX: 'auto', p: '1.5rem' }}>
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
                <Checkbox sx={{ mr: '1.5rem' }} onChange={(_, checked) => { onCheck({ id: supplier.id, checked }); }} />
                {supplier.id}
              </TableCell>
              <TableCell>
                <b>{supplier.name}</b>
              </TableCell>
              <TableCell>
                {supplier.representative || '--'}
              </TableCell>
              <TableCell>
                {supplier.email || '--'}
              </TableCell>
              <TableCell>
                {supplier.partner || '--'}
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
    </Card>
  );
}

export default SuppliersList;
