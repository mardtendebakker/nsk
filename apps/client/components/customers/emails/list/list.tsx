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

export default function List({
  emails = [],
  count,
  page,
  onPageChanged,
  onChecked,
}: {
  emails: any[],
  count: number,
  page: number,
  onPageChanged: (newPage: number)=>void,
  onChecked: (object: { id: number, checked: boolean })=>void,
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
              {trans('recipients')}
            </TableCell>
            <TableCell>
              {trans('openRate')}
            </TableCell>
            <TableCell>
              {trans('clickRate')}
            </TableCell>
            <TableCell>
              {trans('unsubscribes')}
            </TableCell>
            <TableCell>
              {trans('status')}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody />
      </Table>
      <Pagination
        sx={{ display: 'flex', justifyContent: 'end', mt: '2rem' }}
        shape="rounded"
        count={count}
        onChange={(_, newPage) => onPageChanged(newPage)}
        page={page}
      />
    </>
  );
}
