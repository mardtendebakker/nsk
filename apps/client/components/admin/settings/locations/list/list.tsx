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
            {trans('name')}
          </TableCell>
          <TableCell>
            {trans('status')}
          </TableCell>
          <TableCell>
            {trans('unitCapacity')}
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
