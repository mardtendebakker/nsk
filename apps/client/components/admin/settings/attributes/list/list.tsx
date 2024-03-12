import {
  TableBody, TableHead, TableRow,
} from '@mui/material';
import PaginatedTable from '../../../../paginatedTable';
import TableCell from '../../../../tableCell';
import { Attribute } from '../../../../../utils/axios/models/product';
import useTranslation from '../../../../../hooks/useTranslation';
import EditResource from '../../../../button/editResource';

export default function List({
  attributes,
  onEdit,
  disabled,
  count,
  page,
  onPageChange,
  onRowsPerPageChange,
  rowsPerPage,
}: {
  onEdit: (id: number) => void,
  attributes: Attribute[],
  count: number,
  page: number,
  onPageChange: (newPage: number)=>void,
  onRowsPerPageChange: (rowsPerPage: number)=>void,
  rowsPerPage: number,
  disabled: boolean
}) {
  const { trans } = useTranslation();

  return (
    <PaginatedTable
      count={count}
      page={page}
      onPageChange={onPageChange}
      onRowsPerPageChange={onRowsPerPageChange}
      rowsPerPage={rowsPerPage}
      disabled={disabled}
    >
      <TableHead>
        <TableRow>
          <TableCell>
            {trans('name')}
          </TableCell>
          <TableCell>
            {trans('code')}
          </TableCell>
          <TableCell>
            {trans('type')}
          </TableCell>
          <TableCell align="right">
            {trans('actions')}
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {attributes.map((attribute: Attribute) => (
          <TableRow key={attribute.id}>
            <TableCell>
              {attribute.name}
            </TableCell>
            <TableCell>
              {attribute.attr_code}
            </TableCell>
            <TableCell>
              {attribute.type}
            </TableCell>
            <TableCell align="right">
              <EditResource onClick={() => onEdit(attribute.id)} disabled={disabled} requiredModule="attributes" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </PaginatedTable>
  );
}
