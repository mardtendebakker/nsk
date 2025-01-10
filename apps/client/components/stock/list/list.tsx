import {
  TableBody,
  TableHead,
  TableRow,
} from '@mui/material';
import { useState } from 'react';
import useTranslation from '../../../hooks/useTranslation';
import { ProductListItem } from '../../../utils/axios/models/product';
import PaginatedTable from '../../paginatedTable';
import TableCell from '../../tableCell';
import Row, { OnCheck } from './row';
import { ProductType } from '../type';

export default function List({
  type,
  products = [],
  count,
  page,
  onPageChange,
  onRowsPerPageChange,
  rowsPerPage,
  onCheck,
  onEdit,
  onDelete,
  onSplit,
  checkedProductIds,
  disabled = false,
  disableSelection = () => false,
}: {
  type: ProductType,
  products: ProductListItem[],
  count: number,
  page: number,
  onPageChange: (newPage: number)=>void,
  onRowsPerPageChange: (rowsPerPage: number)=>void,
  rowsPerPage: number,
  onCheck: OnCheck,
  onEdit?: (id: number) => void,
  onDelete?: (id: number) => void,
  onSplit?: (product: ProductListItem) => void,
  disabled?: boolean,
  checkedProductIds: number[],
  disableSelection?: (product: ProductListItem) => boolean
}) {
  const hasAction = onEdit || onDelete || onSplit;

  const { trans } = useTranslation();
  const [shownProductTasks, setShownProductTasks] = useState<number | undefined>();

  const handleClick = ({ id }) => {
    setShownProductTasks(id == shownProductTasks ? undefined : id);
  };

  return (
    <PaginatedTable
      count={count}
      page={page}
      onPageChange={onPageChange}
      onRowsPerPageChange={onRowsPerPageChange}
      rowsPerPage={rowsPerPage}
    >
      <TableHead>
        <TableRow>
          <TableCell withPlaceHolder={false} width="5px" />
          <TableCell>
            {trans('Atr.nr')}
          </TableCell>
          <TableCell>
            {trans('serialNumber')}
          </TableCell>
          <TableCell>
            {trans('productName/type')}
          </TableCell>
          <TableCell>
            {trans('location')}
          </TableCell>
          <TableCell>
            {trans('price')}
          </TableCell>
          {type != 'product' && (
            <TableCell>
              {trans('orderDate')}
            </TableCell>
          )}
          {type == 'product' && (
            <TableCell>
              {trans('purchased')}
            </TableCell>
          )}
          <TableCell>
            {trans('inStock')}
          </TableCell>
          <TableCell>
            {trans('ready')}
          </TableCell>
          {type == 'product' && (
            <TableCell>
              {trans('sold')}
            </TableCell>
          )}
          <TableCell>
            {trans('taskStatus')}
          </TableCell>
          {hasAction && (
          <TableCell align="right">
            {trans('actions')}
          </TableCell>
          )}
        </TableRow>
      </TableHead>
      <TableBody>
        {products.map(
          (product: ProductListItem) => (
            <Row
              type={type}
              shownProductTasks={shownProductTasks}
              onClick={handleClick}
              key={product.id}
              checkedProductIds={checkedProductIds}
              product={product}
              onCheck={onCheck}
              disabled={disabled}
              onDelete={onDelete}
              onEdit={onEdit}
              onSplit={onSplit}
              disableSelection={disableSelection}
            />
          ),
        )}
      </TableBody>
    </PaginatedTable>
  );
}
