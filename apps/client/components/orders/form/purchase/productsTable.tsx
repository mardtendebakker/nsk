import {
  Box,
  Button,
  TableBody,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  useState, useEffect, useCallback,
} from 'react';
import Add from '@mui/icons-material/Add';
import { Product, ProductListItem } from '../../../../utils/axios/models/product';
import debounce from '../../../../utils/debounce';
import TextField from '../../../memoizedInput/textField';
import CreateModal from '../../../stock/createModal';
import useTranslation from '../../../../hooks/useTranslation';
import useAxios from '../../../../hooks/useAxios';
import { APRODUCT_PATH } from '../../../../utils/axios';
import EditModal from '../../../stock/editModal';
import Edit from '../../../button/edit';
import PaginatedTable from '../../../paginatedTable';
import TableCell from '../../../tableCell';
import can from '../../../../utils/can';
import useSecurity from '../../../../hooks/useSecurity';
import Can from '../../../can';

export default function ProductsTable({ orderId }:{ orderId: string }) {
  const { state: { user } } = useSecurity();
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editProductId, setEditProductId] = useState<number | undefined>();
  const [page, setPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);

  const { trans } = useTranslation();

  const { data: { data = [], count = 0 } = {}, call } = useAxios(
    'get',
    APRODUCT_PATH.replace(':id', ''),
    {
      withProgressBar: true,
      defaultParams: {
        orderBy: JSON.stringify({ created_at: 'asc' }),
      },
    },
  );

  const { call: callPut } = useAxios('put', undefined, { withProgressBar: true });

  const handleProductPropertyChange = useCallback(debounce((product: ProductListItem, property: string, value) => {
    callPut({
      path: APRODUCT_PATH.replace(':id', product.id.toString()),
      body: {
        product_orders: [
          {
            [property]: value,
            id: product.product_order.id,
          },
        ],
      },
    });
  }), []);

  useEffect(() => {
    call({
      params: {
        take: rowsPerPage,
        skip: (page - 1) * rowsPerPage,
        orderId,
      },
    });
  }, [page, rowsPerPage, orderId]);

  return (
    <>
      <Can requiredGroups={['admin', 'super_admin', 'manager', 'logistics', 'local']}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button size="small" onClick={() => setShowForm(true)} sx={{ mb: '.5rem' }}>
            <Add />
            {trans('addAnotherProduct')}
          </Button>
        </Box>
      </Can>
      <PaginatedTable
        count={count}
        page={page}
        onPageChange={setPage}
        onRowsPerPageChange={setRowsPerPage}
        rowsPerPage={rowsPerPage}
      >
        <TableHead>
          <TableRow>
            <TableCell>
              {trans('ID')}
            </TableCell>
            <TableCell>
              {trans('sku')}
            </TableCell>
            <TableCell>
              {trans('productName')}
            </TableCell>
            <TableCell>
              {trans('productType')}
            </TableCell>
            <TableCell>
              {trans('retailPrice')}
            </TableCell>
            <TableCell>
              {trans('purchasePrice')}
            </TableCell>
            <TableCell>
              {trans('purchaseQuantity')}
            </TableCell>
            <TableCell align="right">
              {trans('actions')}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map(
            (product: ProductListItem) => (
              <TableRow key={product.id}>
                <TableCell>{product.id}</TableCell>
                <TableCell>{product.sku}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.type}</TableCell>
                <TableCell>
                  {product.price}
                </TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    placeholder="1"
                    defaultValue={product.product_order.price.toString()}
                    onChange={(e) => handleProductPropertyChange(
                      product,
                      'price',
                      e.target.value,
                    )}
                    disabled={!can(user?.groups || [], ['admin', 'super_admin', 'manager', 'logistics', 'local'])}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    placeholder="1"
                    defaultValue={product.product_order.quantity.toString()}
                    onChange={(e) => handleProductPropertyChange(
                      product,
                      'quantity',
                      e.target.value,
                    )}
                    disabled={!can(user?.groups || [], ['admin', 'super_admin', 'manager', 'logistics', 'local'])}
                  />
                </TableCell>
                <TableCell align="right">
                  <Can requiredGroups={['admin', 'super_admin', 'manager', 'logistics', 'local']}>
                    <Edit onClick={() => setEditProductId(product.id)} />
                  </Can>
                </TableCell>
              </TableRow>
            ),
          )}
        </TableBody>
      </PaginatedTable>
      {showForm && (
      <CreateModal
        onClose={() => setShowForm(false)}
        onSubmit={(product: Product) => {
          call({
            params: {
              take: rowsPerPage,
              skip: (page - 1) * rowsPerPage,
              orderId,
            },
          });
          setShowForm(false);
          setEditProductId(product.id);
        }}
        additionalPayloadData={{
          'product_orders[0][order_id]': orderId,
          'product_orders[0][quantity]': '1',
        }}
      />
      )}
      {editProductId && <EditModal id={editProductId.toString()} onClose={() => setEditProductId(undefined)} onSubmit={() => setEditProductId(undefined)} />}
    </>
  );
}
