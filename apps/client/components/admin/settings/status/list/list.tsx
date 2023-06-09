import {
  Table, TableBody, TableCell, TableHead, TableRow,
} from '@mui/material';
import useTranslation from '../../../../../hooks/useTranslation';

export default function List() {
  const { trans } = useTranslation();

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>
            {trans('id')}
          </TableCell>
          <TableCell>
            {trans('statusName')}
          </TableCell>
          <TableCell>
            {trans('purchase')}
          </TableCell>
          <TableCell>
            {trans('sale')}
          </TableCell>
          <TableCell>
            {trans('task')}
          </TableCell>
          <TableCell>
            {trans('actions')}
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody />
    </Table>
  );
}
