import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
} from '@mui/material';
import Edit from '../../button/edit';
import Delete from '../../button/delete';
import useTranslation from '../../../hooks/useTranslation';
import { CompanyListItem } from '../../../utils/axios/models/company';
import { CONTACTS_CUSTOMERS_EDIT, CONTACTS_SUPPLIERS_EDIT } from '../../../utils/routes';

export default function List({
  type,
  companies = [],
  onDelete,
  count,
  page,
  onPageChange,
  onRowsPerPageChange,
  rowsPerPage,
  disabled,
}: {
  type: 'customer' | 'supplier',
  companies: CompanyListItem[],
  onDelete: (id: number)=>void,
  count: number,
  page: number,
  onPageChange: (newPage: number)=>void,
  onRowsPerPageChange: (rowsPerPage: number)=>void,
  rowsPerPage: number,
  disabled: boolean
}) {
  const { trans } = useTranslation();

  return (
    <>
      <Table size="small">
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
              {trans(type === 'customer' ? 'isPartner' : 'partner')}
            </TableCell>
            <TableCell>
              {trans('actions')}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {companies.map((company: CompanyListItem) => (
            <TableRow
              sx={{
                height: 60,
              }}
              hover
              key={company.id}
            >
              <TableCell>
                <b>{company.name}</b>
              </TableCell>
              <TableCell>
                {company.representative || '--'}
              </TableCell>
              <TableCell>
                {company.email || '--'}
              </TableCell>
              <TableCell>
                {type === 'customer'
                  ? (Boolean(company.is_partner) || '--')
                  : company.partner?.name || '--'}
              </TableCell>
              <TableCell>
                <Edit href={(type === 'customer' ? CONTACTS_CUSTOMERS_EDIT : CONTACTS_SUPPLIERS_EDIT).replace('[id]', company.id.toString())} disabled={disabled} />
                {company.orders?.length === 0
                && (<Delete onClick={() => onDelete(company.id)} disabled={disabled} tooltip />)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
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
        rowsPerPageOptions={[10, 25, 50]}
        onRowsPerPageChange={(e) => {
          if (!disabled) {
            onRowsPerPageChange(parseInt(e.target.value, 10));
          }
        }}
      />
    </>
  );
}
