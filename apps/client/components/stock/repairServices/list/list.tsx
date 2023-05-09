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
import { StockProduct } from '../../../../utils/axios';
import TasksProgress from '../../tasksProgress';

export default function List({
  stockRepairServices = [],
  count,
  page,
  onPageChanged,
  onChecked,
}: {
  stockRepairServices: StockProduct[],
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
              {trans('salesOrderNumber')}
            </TableCell>
            <TableCell>
              {trans('productName/type')}
            </TableCell>
            <TableCell>
              {trans('location')}
            </TableCell>
            <TableCell>
              {trans('orderDate')}
            </TableCell>
            <TableCell>
              {trans('inStock')}
            </TableCell>
            <TableCell>
              {trans('ready')}
            </TableCell>
            <TableCell>
              {trans('delivered')}
            </TableCell>
            <TableCell>
              {trans('taskStatus')}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {stockRepairServices.map((stockRepairService: StockProduct) => (
            <TableRow
              sx={{
                height: 60,
              }}
              hover
              key={stockRepairService.id}
            >
              <TableCell>
                <Checkbox
                  sx={{ mr: '1.5rem' }}
                  onChange={(_, checked) => { onChecked({ id: stockRepairService.id, checked }); }}
                />
                {stockRepairService.sku}
              </TableCell>
              <TableCell>
                {stockRepairService.name}
              </TableCell>
              <TableCell>
                {stockRepairService.location}
              </TableCell>
              <TableCell />
              <TableCell>
                {stockRepairService.stock}
              </TableCell>
              <TableCell>
                {stockRepairService.sale}
              </TableCell>
              <TableCell>
                {stockRepairService.sold}
              </TableCell>
              <TableCell>
                {stockRepairService.tasks.length > 0
                   && (
                   <TasksProgress
                     done={stockRepairService.tasks.filter((task) => task.status == 3).length}
                     tasks={stockRepairService.tasks.filter((task) => task.status != 4).length}
                   />
                   )}
              </TableCell>
            </TableRow>
          ))}
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
