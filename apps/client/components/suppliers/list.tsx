import {
  Card,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  Pagination,
  TableRow,
} from '@mui/material';
import Edit from '@mui/icons-material/Edit';
import { trans } from 'itranslator';
import { Supplier } from '../../utils/axios';

function SuppliersList({
  suppliers = [],
  count,
  page,
  onChange,
  onEdit,

}: {
  suppliers: Supplier[],
  count: number,
  page: number,
  onChange: (newPage: number)=>void,
  onEdit: (id: number) => void
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
                <b>{supplier.name}</b>
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
      <Pagination
        sx={{ display: 'flex', justifyContent: 'end', mt: '2rem' }}
        variant="outlined"
        shape="rounded"
        count={count}
        onChange={(_, newPage) => onChange(newPage)}
        page={page}
      />
    </Card>
  );
}

export default SuppliersList;
