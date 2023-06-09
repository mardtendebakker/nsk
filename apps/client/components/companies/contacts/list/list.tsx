import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Pagination,
  Button,
  Tooltip,
} from '@mui/material';
import { useRouter } from 'next/router';
import { CUSTOMERS_CONTACTS } from 'apps/client/utils/routes';
import Edit from '@mui/icons-material/Edit';
import Delete from '../../../button/delete';
import useTranslation from '../../../../hooks/useTranslation';
import { CompanyListItem } from '../../../../utils/axios/models/company';

export default function List({
  companies = [],
  onDelete,
  onEdit,
  count,
  page,
  onPageChange,
  disabled,
}: {
  companies: CompanyListItem[],
  onDelete: (id: number)=>void,
  onEdit: (id: number)=>void,
  count: number,
  page: number,
  onPageChange: (newPage: number)=>void,
  disabled: boolean
}) {
  const { trans } = useTranslation();
  const router = useRouter();

  return (
    <>
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
              {trans(router.pathname == CUSTOMERS_CONTACTS ? 'isPartner' : 'partner')}
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
                <b>{company.id}</b>
              </TableCell>
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
                {router.pathname == CUSTOMERS_CONTACTS
                  ? (Boolean(company.is_partner) || '--')
                  : company.partner?.name || '--'}
              </TableCell>
              <TableCell>
                <Tooltip title={trans('edit')}>
                  <Button onClick={() => onEdit(company.id)} sx={{ mr: '1rem' }} variant="outlined" color="primary" disabled={disabled}>
                    <Edit sx={{ mr: '.1rem' }} />
                  </Button>
                </Tooltip>
                {company.orders?.length === 0
                && (<Delete onDelete={() => onDelete(company.id)} disabled={disabled} tooltip />)}
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
