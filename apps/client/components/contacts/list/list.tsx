import {
  TableBody,
  TableHead,
  TableRow,
} from '@mui/material';
import Check from '@mui/icons-material/Check';
import useTranslation from '../../../hooks/useTranslation';
import { ContactListItem } from '../../../utils/axios/models/contact';
import TableCell from '../../tableCell';
import EditResource from '../../button/editResource';
import DeleteResource from '../../button/deleteResource';
import PaginatedTable from '../../paginatedTable';

export default function List({
  contacts = [],
  onDelete,
  count,
  page,
  onPageChange,
  onRowsPerPageChange,
  rowsPerPage,
  disabled,
  editContactRouteBuilder,
  hideCompanyFields = false,
}: {
  contacts: ContactListItem[],
  onDelete: (id: number)=>void,
  count: number,
  page: number,
  onPageChange: (newPage: number)=>void,
  onRowsPerPageChange: (rowsPerPage: number)=>void,
  rowsPerPage: number,
  disabled: boolean,
  editContactRouteBuilder: (contact: ContactListItem) => string,
  hideCompanyFields?: boolean
}) {
  const { trans } = useTranslation();

  return (
    <PaginatedTable
      count={count}
      onPageChange={onPageChange}
      page={page}
      rowsPerPage={rowsPerPage}
      onRowsPerPageChange={onRowsPerPageChange}
      disabled={disabled}
    >
      <TableHead>
        <TableRow>
          <TableCell>
            {trans('name')}
          </TableCell>
          <TableCell>
            {trans('company')}
          </TableCell>
          <TableCell>
            {trans('email')}
          </TableCell>
          {!hideCompanyFields && (
            <>
              <TableCell>
                {trans('isPartner')}
              </TableCell>
              <TableCell>
                {trans('isSupplier')}
              </TableCell>
              <TableCell>
                {trans('isCustomer')}
              </TableCell>
            </>
          )}
          <TableCell align="right">
            {trans('actions')}
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {contacts.map((contact: ContactListItem) => (
          <TableRow
            sx={{
              height: 60,
            }}
            hover
            key={contact.id}
          >
            <TableCell>
              {contact.name}
            </TableCell>
            <TableCell>
              <b>{contact.company.name}</b>
            </TableCell>
            <TableCell>
              {contact.email}
            </TableCell>
            {!hideCompanyFields && (
              <>
                <TableCell>
                  {contact.company.is_partner && <Check />}
                </TableCell>
                <TableCell>
                  {contact.company.is_supplier && <Check />}
                </TableCell>
                <TableCell>
                  {contact.company.is_customer && <Check />}
                </TableCell>
              </>
            )}
            <TableCell align="right">
              <EditResource href={editContactRouteBuilder(contact)} disabled={disabled} requiredModule="customer_contact_action" />
              {contact.ordersCount === 0
                && (<DeleteResource onClick={() => onDelete(contact.id)} disabled={disabled} requiredModule="customer_contact_action" />)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </PaginatedTable>
  );
}
