import {
  Card,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Pagination,
} from '@mui/material';
import Edit from '@mui/icons-material/Edit';
import useTranslation from '../../hooks/useTranslation';
import { Customer } from '../../utils/axios';

function CustomersList({
  customers = [],
  count,
  page,
  onChange,
  onEdit,
}: {
  customers: Customer[],
  count: number,
  page: number,
  onChange: (newPage: number)=>void,
  onEdit: (id: number) => void
}) {
  const { trans } = useTranslation();

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
              {trans('isPartner')}
            </TableCell>
            <TableCell />
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
                <b>{customer.name}</b>
              </TableCell>
              <TableCell>
                {customer.representative}
              </TableCell>
              <TableCell>
                {customer.email}
              </TableCell>
              <TableCell>
                {Boolean(customer.is_partner)}
              </TableCell>
              <TableCell>
                <IconButton onClick={() => onEdit(customer.id)}>
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

export default CustomersList;
