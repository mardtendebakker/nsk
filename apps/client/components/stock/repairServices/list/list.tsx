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
import { Product, RepairService } from '../../../../utils/axios';
import Status from '../../status';

export default function List({
  repairServices = [],
  count,
  page,
  onPageChanged,
  onChecked,
}: {
  repairServices: RepairService[],
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
          {repairServices.map((repairService: Product) => (
            <>
              <TableRow
                sx={{
                  height: 60,
                }}
                hover
                key={repairService.id}
              >
                <TableCell>
                  <Checkbox sx={{ mr: '1.5rem' }} onChange={(_, checked) => { onChecked({ id: repairService.id, checked }); }} />
                </TableCell>
                <TableCell />
                <TableCell />
                <TableCell />
                <TableCell />
                <TableCell />
                <TableCell />
                <TableCell />
              </TableRow>
              <TableRow sx={(theme) => ({ backgroundColor: theme.palette.grey[10] })}>
                <TableCell sx={{ padding: 0 }} colSpan={8}>
                  <Collapse in unmountOnExit>
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
