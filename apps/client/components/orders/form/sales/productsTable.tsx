import {
  Box,
  Button,
  TableBody,
  TableHead,
  TableRow,
} from '@mui/material';
import { useEffect, useCallback, useState } from 'react';
import Add from '@mui/icons-material/Add';
import { ProductListItem } from '../../../../utils/axios/models/product';
import debounce from '../../../../utils/debounce';
import TextField from '../../../memoizedInput/textField';
import useTranslation from '../../../../hooks/useTranslation';
import useAxios from '../../../../hooks/useAxios';
import { APRODUCT_PATH, SALES_ORDERS_PRODUCTS_PATH, STOCK_PRODUCTS_PATH } from '../../../../utils/axios';
import Delete from '../../../button/delete';
import PaginatedTable from '../../../paginatedTable';
import TableCell from '../../../tableCell';
import AddProductsModal from '../addProductsModal';

export default function ProductsTable({ orderId, refreshOrder }:{ orderId: string, refreshOrder: () => void }) {
  const { trans } = useTranslation();
  const [showProductsModal, setShowProductsModal] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);

  const { call: callPut } = useAxios('put', undefined, { withProgressBar: true });
  const { call: callPutWithProgressBar } = useAxios('put', undefined, { withProgressBar: true });
  const { call: callDelete } = useAxios('delete', undefined, { withProgressBar: true, showSuccessMessage: true });
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

  const handleProductPropertyChange = useCallback(debounce((product, property: string, value) => {
    callPut({
      path: STOCK_PRODUCTS_PATH.replace(':id', product.id.toString()),
      body: {
        product_orders: [
          {
            [property]: value,
            id: product.product_order.id,
          },
        ],
      },
    }).then(() => {
      refreshOrder();
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

  const handleProductsAdded = (productIds: number[]) => {
    callPutWithProgressBar({
      path: SALES_ORDERS_PRODUCTS_PATH.replace(':id', orderId),
      body: productIds,
    }).then(() => {
      setShowProductsModal(false);
      call({
        params: {
          take: rowsPerPage,
          skip: (page - 1) * rowsPerPage,
          orderId,
        },
      });
    });
  };

  const handleDeleteProduct = (id: number) => {
    callDelete({ path: SALES_ORDERS_PRODUCTS_PATH.replace(':id', orderId), body: [id] }).then(() => {
      call({
        params: {
          take: rowsPerPage,
          skip: (page - 1) * rowsPerPage,
          orderId,
        },
      });
    });
  };

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button size="small" onClick={() => setShowProductsModal(true)} sx={{ mb: '.5rem' }}>
          <Add />
          {trans('addProducts')}
        </Button>
      </Box>
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
              {trans('sku')}
            </TableCell>
            <TableCell>
              {trans('productName')}
            </TableCell>
            <TableCell>
              {trans('productType')}
            </TableCell>
            <TableCell>
              {trans('retailUnitPrice')}
            </TableCell>
            <TableCell>
              {trans('stockQuantity')}
            </TableCell>
            <TableCell>
              {trans('unitPrice')}
            </TableCell>
            <TableCell>
              {trans('quantity')}
            </TableCell>
            <TableCell>
              {trans('actions')}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((product: ProductListItem) => (
            <TableRow key={product.id}>
              <TableCell>{product.sku}</TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.type}</TableCell>
              <TableCell>
                {product.price}
              </TableCell>
              <TableCell>
                {product.stock}
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
                />
              </TableCell>
              <TableCell>
                <Delete onDelete={() => handleDeleteProduct(product.id)} tooltip />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </PaginatedTable>
      {showProductsModal && (<AddProductsModal orderId={orderId} onProductsAdded={handleProductsAdded} onClose={() => setShowProductsModal(false)} />)}
    </>
  );
}
