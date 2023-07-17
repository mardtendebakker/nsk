import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
} from '@mui/material';
import { useRouter } from 'next/router';
import Edit from '../../button/edit';
import { CONTACTS_CUSTOMERS } from '../../../utils/routes';
import Delete from '../../button/delete';
import useTranslation from '../../../hooks/useTranslation';
import { CompanyListItem } from '../../../utils/axios/models/company';

export default function List({
  companies = [],
  onDelete,
  onEdit,
  count,
  page,
  onPageChange,
  onRowsPerPageChange,
  rowsPerPage,
  disabled,
}: {
  companies: CompanyListItem[],
  onDelete: (id: number)=>void,
  onEdit: (id: number)=>void,
  count: number,
  page: number,
  onPageChange: (newPage: number)=>void,
  onRowsPerPageChange: (rowsPerPage: number)=>void,
  rowsPerPage: number,
  disabled: boolean
}) {
  const { trans } = useTranslation();
  const router = useRouter();

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
              {trans(router.pathname == CONTACTS_CUSTOMERS ? 'isPartner' : 'partner')}
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
                {router.pathname == CONTACTS_CUSTOMERS
                  ? (Boolean(company.is_partner) || '--')
                  : company.partner?.name || '--'}
              </TableCell>
              <TableCell>
                <Edit onClick={() => onEdit(company.id)} disabled={disabled} sx={{ mr: '1rem' }} />
                {company.orders?.length === 0
                && (<Delete onDelete={() => onDelete(company.id)} disabled={disabled} tooltip />)}
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
