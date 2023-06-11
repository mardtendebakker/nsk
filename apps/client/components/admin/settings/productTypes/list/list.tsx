import {
  Table, TableBody, TableCell, TableHead, TableRow, Pagination,
} from '@mui/material';
import Edit from '../../../../button/edit';
import { ProductType } from '../../../../../utils/axios/models/product';
import useTranslation from '../../../../../hooks/useTranslation';

export default function List({
  productTypes,
  onEdit,
  disabled,
  count,
  onPageChange,
  page,
}: {
  onEdit: (id: number) => void,
  productTypes: ProductType[],
  count: number,
  page: number,
  onPageChange: (newPage: number)=>void,
  disabled: boolean
}) {
  const { trans } = useTranslation();

  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              {trans('id')}
            </TableCell>
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
                {productType.id}
              </TableCell>
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
