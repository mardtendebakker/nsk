import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Pagination,
  Checkbox,
  Collapse,
  Box,
  Typography,
} from '@mui/material';
import useTranslation from '../../../../hooks/useTranslation';
import { StockProduct } from '../../../../utils/axios';
import Status from '../../status';

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
              {trans('status')}
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
                {stockRepairService.hold > 0
                && <Status done={stockRepairService.done} tasks={stockRepairService.hold} />}
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
