import {
  TableBody, TableHead, TableRow,
} from '@mui/material';
import PaginatedTable from '../../../../paginatedTable';
import TableCell from '../../../../tableCell';
import Edit from '../../../../button/edit';
import useTranslation from '../../../../../hooks/useTranslation';
import { ProductSubType } from '../../../../../utils/axios/models/product';

export default function List({
  productSubTypes,
  onEdit,
  disabled,
  count,
  page,
  onPageChange,
  onRowsPerPageChange,
  rowsPerPage,
}: {
  onEdit: (id: number) => void,
  productSubTypes: ProductSubType[],
  count: number,
  page: number,
  onPageChange: (newPage: number)=>void,
  onRowsPerPageChange: (rowsPerPage: number)=>void,
  rowsPerPage: number,
  disabled: boolean
}) {
  const { trans } = useTranslation();

  return (
    <PaginatedTable
      count={count}
      page={page}
      onPageChange={onPageChange}
      onRowsPerPageChange={onRowsPerPageChange}
      rowsPerPage={rowsPerPage}
      disabled={disabled}
    >
      <TableHead>
        <TableRow>
          <TableCell>
            {trans('name')}
          </TableCell>
          <TableCell>
            {trans('productType')}
          </TableCell>
          <TableCell>
            {trans('magentoCategoryId')}
          </TableCell>
          <TableCell>
            {trans('magentoAttrSetId')}
          </TableCell>
          <TableCell align="right">
            {trans('actions')}
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {productSubTypes.map((productSubType: ProductSubType) => (
          <TableRow key={productSubType.id}>
            <TableCell>
              {productSubType.name}
            </TableCell>
            <TableCell>
              {productSubType.productType?.name || '-'}
            </TableCell>
            <TableCell>
              {productSubType.magento_category_id || '-'}
            </TableCell>
            <TableCell>
              {productSubType.magento_attr_set_id || '-'}
            </TableCell>
            <TableCell align="right">
              <Edit onClick={() => onEdit(productSubType.id)} disabled={disabled} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </PaginatedTable>
  );
}
