import {
  Table,
  TableBody,
  TableHead,
  TableRow,
  Checkbox,
  Collapse,
  Box,
} from '@mui/material';
import { format } from 'date-fns';
import useTranslation from '../../../hooks/useTranslation';
import { ProductListItem } from '../../../utils/axios/models/product';
import TasksProgress from './tasksProgress';
import TaskStatusTableCell from './taskStatusTableCell';
import TableCell from '../../tableCell';
import Edit from '../../button/edit';
import Delete from '../../button/delete';
import Split from '../../button/split';
import { price } from '../../../utils/formatter';
import { ProductType } from '../type';

export type OnCheck = (object: { id: number, checked: boolean }) => void;
type OnClick = (object: { id: number }) => void;

export default function Row(
  {
    type,
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
    type: ProductType
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
  const hasAction = onEdit || onDelete || onSplit;

  return (
    <>
      <TableRow
        sx={{ height: 60 }}
        hover
      >
        <TableCell>
          <Checkbox
            checked={Boolean(checkedProductIds.find((id) => id === product.id))}
            sx={{ p: '0' }}
            onChange={(_, checked) => onCheck({ id: product.id, checked })}
            disabled={disabled || disableSelection(product)}
          />
        </TableCell>
        <TableCell>
          {onEdit ? (
            <Box sx={{ textDecoration: 'underline', cursor: 'pointer', display: 'inline' }} onClick={() => onEdit(product.id)}>
              {product.id}
            </Box>
          ) : product.id}
        </TableCell>
        <TableCell>
          {product.sku}
        </TableCell>
        <TableCell>
          {product.name}
        </TableCell>
        <TableCell>
          {product.location}
        </TableCell>
        <TableCell>
          {price(product.price)}
        </TableCell>
        {type != 'product' && (
        <TableCell>
          {product.order_date ? format(new Date(product.order_date), 'yyyy/MM/dd') : '--'}
        </TableCell>
        )}
        {type == 'product' && (
        <TableCell>
          {product.purch}
        </TableCell>
        )}
        <TableCell>
          {product.stock}
        </TableCell>
        <TableCell>
          {product.sale}
        </TableCell>
        {type == 'product' && (
          <TableCell>
            {product.sold}
          </TableCell>
        )}
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
        {hasAction && (
        <TableCell align="right">
          {onEdit && <Edit onClick={() => onEdit(product.id)} disabled={disabled} />}
          {onSplit && product.splittable && <Split onClick={() => onSplit(product)} disabled={disabled} />}
          {onDelete && <Delete onClick={() => onDelete(product.id)} disabled={disabled} tooltip />}
        </TableCell>
        )}
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
