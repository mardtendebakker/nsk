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
import useTranslation from '../../../../hooks/useTranslation';
import { StockProduct } from '../../../../utils/axios';
import TasksProgress from '../../tasksProgress';
import TaskStatusTableCell from '../../taskStatusTableCell';

type OnChecked = (object: { id: number, checked: boolean }) => void;
type OnClick = (object: { id: number }) => void;

function Row(
  {
    stockProduct, onChecked, onClick, checkedProductIds, shownProductTasks,
  }
  : {
    stockProduct: StockProduct,
    onChecked: OnChecked,
    onClick: OnClick,
    checkedProductIds: number[],
    shownProductTasks: number | undefined
  },
) {
  const { trans } = useTranslation();

  return (
    <>
      <TableRow
        sx={{ height: 60 }}
        hover
      >
        <TableCell>
          <Checkbox
            checked={Boolean(checkedProductIds.find((id) => id === stockProduct.id))}
            sx={{ mr: '1.5rem' }}
            onChange={(_, checked) => onChecked({ id: stockProduct.id, checked })}
          />
          {stockProduct.sku}
        </TableCell>
        <TableCell>
          {stockProduct.name}
        </TableCell>
        <TableCell>
          {stockProduct.location}
        </TableCell>
        <TableCell>
          €
          {stockProduct.price.toFixed(2)}
        </TableCell>
        <TableCell>
          {stockProduct.purch}
        </TableCell>
        <TableCell>
          {stockProduct.stock}
        </TableCell>
        <TableCell>
          {stockProduct.sale}
        </TableCell>
        <TableCell>
          {stockProduct.sold}
        </TableCell>
        <TableCell
          sx={{ cursor: 'pointer' }}
          onClick={() => onClick({ id: stockProduct.id })}
        >
          {stockProduct.tasks.length > 0
                   && (
                   <TasksProgress
                     done={stockProduct.tasks.filter((task) => task.status == 3).length}
                     tasks={stockProduct.tasks.filter((task) => task.status != 4).length}
                   />
                   )}
        </TableCell>
      </TableRow>
      {stockProduct.tasks.length > 0 && (
      <TableRow
        sx={(theme) => ({ backgroundColor: theme.palette.grey[10] })}
      >
        <TableCell colSpan={9} sx={{ padding: 0 }}>
          <Collapse in={stockProduct.id == shownProductTasks} unmountOnExit mountOnEnter>
            <Table sx={{ borderRadius: 0 }}>
              <TableHead>
                <TableRow>
                  <TableCell>{trans('taskName')}</TableCell>
                  <TableCell>{trans('status')}</TableCell>
                  <TableCell>{trans('description')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stockProduct.tasks.map(({ name, status, description }) => (
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
  stockProducts = [],
  count,
  page,
  onPageChanged,
  onChecked,
  checkedProductIds,
}: {
  stockProducts: StockProduct[],
  count: number,
  page: number,
  onPageChanged: (newPage: number)=>void,
  onChecked: OnChecked,
  checkedProductIds: number[]
}) {
  const { trans } = useTranslation();
  const [shownProductTasks, setShownProductTasks] = useState<number | undefined>();

  const handleClick = ({ id }) => {
    setShownProductTasks(id == shownProductTasks ? undefined : id);
  };

  return (
    <>
      <Table>
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
            <TableCell>
              {trans('price')}
            </TableCell>
            <TableCell>
              {trans('purchased')}
            </TableCell>
            <TableCell>
              {trans('inStock')}
            </TableCell>
            <TableCell>
              {trans('ready')}
            </TableCell>
            <TableCell>
              {trans('sold')}
            </TableCell>
            <TableCell>
              {trans('taskStatus')}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {stockProducts.map(
            (stockProduct: StockProduct) => (
              <Row
                shownProductTasks={shownProductTasks}
                onClick={handleClick}
                key={stockProduct.id}
                checkedProductIds={checkedProductIds}
                stockProduct={stockProduct}
                onChecked={onChecked}
              />
            ),
          )}
        </TableBody>
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
