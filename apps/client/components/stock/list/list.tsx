import {
  Table,
  TableBody,
  TableHead,
  TableRow,
  Checkbox,
  Collapse,
} from '@mui/material';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { format } from 'date-fns';
import useTranslation from '../../../hooks/useTranslation';
import { ProductListItem } from '../../../utils/axios/models/product';
import TasksProgress from './tasksProgress';
import TaskStatusTableCell from './taskStatusTableCell';
import { STOCKS_PRODUCTS } from '../../../utils/routes';
import PaginatedTable from '../../paginatedTable';
import TableCell from '../../tableCell';
import Edit from '../../button/edit';
import Delete from '../../button/delete';
import Split from '../../button/split';

type OnCheck = (object: { id: number, checked: boolean }) => void;
type OnClick = (object: { id: number }) => void;

function Row(
  {
    product,
    onCheck,
    onClick,
    checkedProductIds,
    shownProductTasks,
    onEdit,
    onDelete,
    onSplit,
    disabled,
    disableSelection,
  }
  : {
    product: ProductListItem,
    onCheck: OnCheck,
    onClick: OnClick,
    checkedProductIds: number[],
    shownProductTasks: number | undefined,
    onEdit?: (id: number) => void,
    onDelete?: (id: number) => void,
    onSplit?: (product: ProductListItem) => void,
    disabled: boolean,
    disableSelection: (product: ProductListItem) => boolean
  },
) {
  const { trans } = useTranslation();
  const router = useRouter();
  const stockProductsPage = router.pathname == STOCKS_PRODUCTS;

  return (
    <>
      <TableRow
        sx={{ height: 60 }}
        hover
      >
        <TableCell>
          <Checkbox
            checked={Boolean(checkedProductIds.find((id) => id === product.id))}
            sx={{ mr: '1.5rem' }}
            onChange={(_, checked) => onCheck({ id: product.id, checked })}
            disabled={disabled || disableSelection(product)}
          />
          {product.sku}
        </TableCell>
        <TableCell>
          {product.name || '--'}
        </TableCell>
        <TableCell>
          {product.location || '--'}
        </TableCell>
        {stockProductsPage && (
        <TableCell>
          €
          {product.price.toFixed(2)}
        </TableCell>
        )}
        {!stockProductsPage && (
        <TableCell>
          {product.order_date ? format(new Date(product.order_date), 'yyyy/MM/dd') : '--'}
        </TableCell>
        )}
        {stockProductsPage && (
        <TableCell>
          {product.purch || '--'}
        </TableCell>
        )}
        <TableCell>
          {product.stock || '--'}
        </TableCell>
        <TableCell>
          {product.sale || '--'}
        </TableCell>
        <TableCell>
          {product.sold || '--'}
        </TableCell>
        <TableCell
          sx={{ cursor: 'pointer' }}
          onClick={() => onClick({ id: product.id })}
        >
          {product.tasks?.length > 0
            ? (
              <TasksProgress
                done={product.tasks.filter((task) => task.status == 3).length}
                tasks={product.tasks.filter((task) => task.status != 4).length}
              />
            ) : '--'}
        </TableCell>
        <TableCell>
          {onEdit && <Edit onClick={() => onEdit(product.id)} disabled={disabled} />}
          {onSplit && product.splittable && <Split onClick={() => onSplit(product)} disabled={disabled} />}
          {onDelete && <Delete onDelete={() => onDelete(product.id)} disabled={disabled} tooltip />}
        </TableCell>
      </TableRow>
      {product.tasks?.length > 0 && (
      <TableRow
        sx={(theme) => ({ backgroundColor: theme.palette.grey[10] })}
      >
        <TableCell colSpan={9} sx={{ padding: 0 }}>
          <Collapse in={product.id == shownProductTasks} unmountOnExit mountOnEnter>
            <Table sx={{ borderRadius: 0 }} size="small">
              <TableHead>
                <TableRow>
                  <TableCell>{trans('taskName')}</TableCell>
                  <TableCell>{trans('status')}</TableCell>
                  <TableCell>{trans('description')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {product.tasks?.map(({ name, status, description }) => (
                  <TableRow key={name} sx={{ height: 60 }}>
                    <TableCell sx={{ padding: '0 16px' }}>
                      {name}
                    </TableCell>
                    <TableCell sx={{ padding: '0 16px' }}>
                      {description}
                    </TableCell>
                    <TaskStatusTableCell status={status} />
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Collapse>
        </TableCell>
      </TableRow>
      )}
    </>
  );
}

export default function List({
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
  disabled,
  checkedProductIds,
  disableSelection,
}: {
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
  const { trans } = useTranslation();
  const [shownProductTasks, setShownProductTasks] = useState<number | undefined>();
  const router = useRouter();
  const stockProductsPage = router.pathname == STOCKS_PRODUCTS;

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
          <TableCell>
            {trans('serialNumber')}
          </TableCell>
          <TableCell>
            {trans('productName/type')}
          </TableCell>
          <TableCell>
            {trans('location')}
          </TableCell>
          {stockProductsPage && (
            <TableCell>
              {trans('price')}
            </TableCell>
          )}
          {!stockProductsPage && (
            <TableCell>
              {trans('orderDate')}
            </TableCell>
          )}
          {stockProductsPage && (
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
          {stockProductsPage && (
            <TableCell>
              {trans('sold')}
            </TableCell>
          )}
          {!stockProductsPage && (
            <TableCell>
              {trans('delivered')}
            </TableCell>
          )}
          <TableCell>
            {trans('taskStatus')}
          </TableCell>
          <TableCell>
            {trans('actions')}
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {products.map(
          (product: ProductListItem) => (
            <Row
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

List.defaultProps = {
  onDelete: undefined, onSplit: undefined, onEdit: undefined, disabled: false, disableSelection: () => false,
};
Row.defaultProps = { onDelete: undefined, onSplit: undefined, onEdit: undefined };
