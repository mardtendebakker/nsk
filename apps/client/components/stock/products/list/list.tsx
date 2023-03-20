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
import useTranslation from '../../../../hooks/useTranslation';
import { StockProduct } from '../../../../utils/axios';
import Status from '../../status';

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
  onChecked: (object: { id: number, checked: boolean })=>void,
  checkedProductIds: number[]
}) {
  const { trans } = useTranslation();

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
              {trans('status')}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {stockProducts.map((stockProduct: StockProduct) => (
            <>
              <TableRow
                sx={{
                  height: 60,
                }}
                hover
                key={stockProduct.id}
              >
                <TableCell>
                  <Checkbox
                    checked={Boolean(checkedProductIds.find((id) => id === stockProduct.id))}
                    sx={{ mr: '1.5rem' }}
                    onChange={(_, checked) => { onChecked({ id: stockProduct.id, checked }); }}
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
                  {stockProduct.done}
                </TableCell>
                <TableCell>
                  {stockProduct.sold}
                </TableCell>
                <TableCell>
                  <Status status="0" />
                </TableCell>
              </TableRow>
              <TableRow sx={(theme) => ({ backgroundColor: theme.palette.grey[10] })}>
                <TableCell sx={{ padding: 0 }} colSpan={9}>
                  <Collapse in={false} unmountOnExit>
                    <Table sx={{ borderRadius: 0 }}>
                      <TableHead>
                        <TableRow>
                          <TableCell>{trans('taskName')}</TableCell>
                          <TableCell>{trans('orderNumber')}</TableCell>
                          <TableCell>{trans('dueBy')}</TableCell>
                          <TableCell>{trans('taskStatus')}</TableCell>
                          <TableCell>{trans('assignedTo')}</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell />
                          <TableCell />
                          <TableCell />
                          <TableCell />
                          <TableCell />
                        </TableRow>
                      </TableBody>
                    </Table>
                  </Collapse>
                </TableCell>
              </TableRow>
            </>
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
