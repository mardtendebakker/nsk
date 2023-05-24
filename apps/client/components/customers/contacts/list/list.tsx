import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Pagination,
  Checkbox,
} from '@mui/material';
import useTranslation from '../../../../hooks/useTranslation';
import { Customer } from '../../../../utils/axios';

export default function List({
  customers = [],
  count,
  page,
  onPageChange,
  onCheck,
  disabled,
}: {
  customers: Customer[],
  count: number,
  page: number,
  onPageChange: (newPage: number)=>void,
  onCheck: (object: { id: number, checked: boolean })=>void,
  disabled: boolean
}) {
  const { trans } = useTranslation();

  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
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
                <Checkbox sx={{ mr: '1.5rem' }} onChange={(_, checked) => { onCheck({ id: customer.id, checked }); }} />
                <b>{customer.name}</b>
              </TableCell>
              <TableCell>
                {customer.representative || '--'}
              </TableCell>
              <TableCell>
                {customer.email || '--'}
              </TableCell>
              <TableCell>
                {Boolean(customer.is_partner) || '--'}
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
        disabled={disabled}
      />
    </>
  );
}
