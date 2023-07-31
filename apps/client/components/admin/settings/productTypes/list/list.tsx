import {
  TableBody, TableHead, TableRow,
} from '@mui/material';
import PaginatedTable from '../../../../paginatedTable';
import TableCell from '../../../../tableCell';
import Edit from '../../../../button/edit';
import { ProductType } from '../../../../../utils/axios/models/product';
import useTranslation from '../../../../../hooks/useTranslation';

export default function List({
  productTypes,
  onEdit,
  disabled,
  count,
  page,
  onPageChange,
  onRowsPerPageChange,
  rowsPerPage,
}: {
  onEdit: (id: number) => void,
  productTypes: ProductType[],
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
            {trans('numberOfAttributes')}
          </TableCell>
          <TableCell>
            {trans('numberOfTasks')}
          </TableCell>
          <TableCell>
            {trans('actions')}
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {productTypes.map((productType: ProductType) => (
          <TableRow key={productType.id}>
            <TableCell>
              {productType.name}
            </TableCell>
            <TableCell>
              {productType.attributes?.length || 0}
            </TableCell>
            <TableCell>
              {productType.tasks?.length || 0}
            </TableCell>
            <TableCell>
              <Edit onClick={() => onEdit(productType.id)} disabled={disabled} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </PaginatedTable>
  );
}
