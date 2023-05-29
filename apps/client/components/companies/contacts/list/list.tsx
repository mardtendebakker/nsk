import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Pagination,
  Checkbox,
} from '@mui/material';
import { useRouter } from 'next/router';
import { CUSTOMERS_CONTACTS } from 'apps/client/utils/routes';
import useTranslation from '../../../../hooks/useTranslation';
import { CompanyListItem } from '../../../../utils/axios/models/company';

export default function List({
  companies = [],
  count,
  page,
  onPageChange,
  onCheck,
  disabled,
}: {
  companies: CompanyListItem[],
  count: number,
  page: number,
  onPageChange: (newPage: number)=>void,
  onCheck: (object: { id: number, checked: boolean })=>void,
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
                <Checkbox sx={{ mr: '1.5rem' }} onChange={(_, checked) => { onCheck({ id: company.id, checked }); }} />
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
