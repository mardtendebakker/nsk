import {
  Table,
  TableBody,
  TableHead,
  TableRow,
  TablePagination,
} from '@mui/material';
import Check from '@mui/icons-material/Check';
import useTranslation from '../../../hooks/useTranslation';
import { COMPANIES_EDIT } from '../../../utils/routes';
import { CompanyListItem } from '../../../utils/axios/models/company';
import TableCell from '../../tableCell';
import EditResource from '../../button/editResource';
import DeleteResource from '../../button/deleteResource';

export default function List({
  companies = [],
  onDelete,
  count,
  page,
  onPageChange,
  onRowsPerPageChange,
  rowsPerPage,
  disabled,
}: {
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
              {trans('company_kvk_nr')}
            </TableCell>
            <TableCell>
              {trans('isPartner')}
            </TableCell>
            <TableCell>
              {trans('isSupplier')}
            </TableCell>
            <TableCell>
              {trans('isCustomer')}
            </TableCell>
            <TableCell align="right">
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
                {company.name}
              </TableCell>
              <TableCell>
                {company.kvk_nr}
              </TableCell>
              <TableCell>
                {company.is_partner && <Check />}
              </TableCell>
              <TableCell>
                {company.is_supplier && <Check />}
              </TableCell>
              <TableCell>
                {company.is_customer && <Check />}
              </TableCell>
              <TableCell align="right">
                <EditResource href={COMPANIES_EDIT.replace('[id]', company.id.toString())} disabled={disabled} requiredModule="customer_contact_action" />
                {company.contactsCount === 0
                && (<DeleteResource onClick={() => onDelete(company.id)} disabled={disabled} requiredModule="customer_contact_action" />)}
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
