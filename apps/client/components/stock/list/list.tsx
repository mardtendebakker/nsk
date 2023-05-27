import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Pagination,
  Checkbox,
  Collapse,
} from '@mui/material';
import { useState } from 'react';
import { useRouter } from 'next/router';
import moment from 'moment';
import useTranslation from '../../../hooks/useTranslation';
import { ProductListItem } from '../../../utils/axios/models/product';
import TasksProgress from './tasksProgress';
import TaskStatusTableCell from './taskStatusTableCell';
import { STOCKS_PRODUCTS } from '../../../utils/routes';

type OnCheck = (object: { id: number, checked: boolean }) => void;
type OnClick = (object: { id: number }) => void;

function Row(
  {
    product, onCheck, onClick, checkedProductIds, shownProductTasks,
  }
  : {
    product: ProductListItem,
    onCheck: OnCheck,
    onClick: OnClick,
    checkedProductIds: number[],
    shownProductTasks: number | undefined
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
          />
          {stockProductsPage ? product.sku : product.order_nr}
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
          {moment(product.order_date.toString()).format('YYYY/MM/DD')}
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
          {product.tasks.length > 0
            ? (
              <TasksProgress
                done={product.tasks.filter((task) => task.status == 3).length}
                tasks={product.tasks.filter((task) => task.status != 4).length}
              />
            ) : '--'}
        </TableCell>
      </TableRow>
      {product.tasks.length > 0 && (
      <TableRow
        sx={(theme) => ({ backgroundColor: theme.palette.grey[10] })}
      >
        <TableCell colSpan={9} sx={{ padding: 0 }}>
          <Collapse in={product.id == shownProductTasks} unmountOnExit mountOnEnter>
            <Table sx={{ borderRadius: 0 }}>
              <TableHead>
                <TableRow>
                  <TableCell>{trans('taskName')}</TableCell>
                  <TableCell>{trans('status')}</TableCell>
                  <TableCell>{trans('description')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {product.tasks.map(({ name, status, description }) => (
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
  onCheck,
  checkedProductIds,
}: {
  products: ProductListItem[],
  count: number,
  page: number,
  onPageChange: (newPage: number)=>void,
  onCheck: OnCheck,
  checkedProductIds: number[]
}) {
  const { trans } = useTranslation();
  const [shownProductTasks, setShownProductTasks] = useState<number | undefined>();
  const router = useRouter();
  const stockProductsPage = router.pathname == STOCKS_PRODUCTS;

  const handleClick = ({ id }) => {
    setShownProductTasks(id == shownProductTasks ? undefined : id);
  };

  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            {stockProductsPage && (
              <TableCell>
                {trans('serialNumber')}
              </TableCell>
            )}
            {!stockProductsPage && (
              <TableCell>
                {trans('orderNumber')}
              </TableCell>
            )}
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
              />
            ),
          )}
        </TableBody>
      </Table>
      <Pagination
        sx={{ display: 'flex', justifyContent: 'end', mt: '2rem' }}
        shape="rounded"
        count={count}
        onChange={(_, newPage) => onPageChange(newPage)}
        page={page}
      />
    </>
  );
}
