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
import { ContactListItem } from '../../../utils/axios/models/contact';
import { CONTACTS_CUSTOMERS_EDIT, CONTACTS_SUPPLIERS_EDIT } from '../../../utils/routes';

export default function List({
  type,
  contacts = [],
  onDelete,
  count,
  page,
  onPageChange,
  onRowsPerPageChange,
  rowsPerPage,
  disabled,
}: {
  type: 'customer' | 'supplier',
  contacts: ContactListItem[],
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
          {contacts.map((contact: ContactListItem) => (
            <TableRow
              sx={{
                height: 60,
              }}
              hover
              key={contact.id}
            >
              <TableCell>
                <b>{contact.name}</b>
              </TableCell>
              <TableCell>
                {contact.representative || '--'}
              </TableCell>
              <TableCell>
                {contact.email || '--'}
              </TableCell>
              <TableCell>
                {type === 'customer'
                  ? (Boolean(contact.is_partner) || '--')
                  : contact.partner?.name || '--'}
              </TableCell>
              <TableCell>
                <Edit href={(type === 'customer' ? CONTACTS_CUSTOMERS_EDIT : CONTACTS_SUPPLIERS_EDIT).replace('[id]', contact.id.toString())} disabled={disabled} />
                {contact.orders?.length === 0
                && (<Delete onClick={() => onDelete(contact.id)} disabled={disabled} tooltip />)}
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
