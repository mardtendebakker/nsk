import {
  Box,
  Button,
  TableBody,
  TableHead,
  TableRow,
} from '@mui/material';
import { useEffect, useCallback, useState } from 'react';
import Add from '@mui/icons-material/Add';
import { ProductListItem, Service } from '../../../../utils/axios/models/product';
import debounce from '../../../../utils/debounce';
import useTranslation from '../../../../hooks/useTranslation';
import useAxios from '../../../../hooks/useAxios';
import {
  STOCK_REPAIRS_PATH, REPAIR_ORDERS_PRODUCTS_PATH, SALES_SERVICES_PATH, APRODUCT_PATH,
} from '../../../../utils/axios';
import PaginatedTable from '../../../paginatedTable';
import TableCell from '../../../tableCell';
import AddProductsModal from '../addProductsModal';
import Row from './row';

export default function ProductsTable({ orderId }:{ orderId: string }) {
  const { trans } = useTranslation();
  const [showProductsModal, setShowProductsModal] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);

  const { call: callPut } = useAxios('put', undefined, { withProgressBar: true });
  const { call: postService } = useAxios('post', SALES_SERVICES_PATH.replace(':id', ''), { showSuccessMessage: true, withProgressBar: true });
  const { call: callDelete } = useAxios('delete', undefined, { withProgressBar: true, showSuccessMessage: true });
  const { data: { data = [], count = 0 } = {}, call } = useAxios(
    'get',
    APRODUCT_PATH.replace(':id', ''),
    {
      withProgressBar: true,
    },
  );

  const handleProductPropertyChange = useCallback(debounce((product: ProductListItem, property: string, value) => {
    callPut({
      path: STOCK_REPAIRS_PATH.replace(':id', product.id.toString()),
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

  const handleServicePropertyChange = useCallback(debounce((service: Service, property: string, value) => {
    callPut({
      path: SALES_SERVICES_PATH.replace(':id', service.id.toString()),
      body: { [property]: value },
    });
  }), []);

  const handleAddService = (id: number) => {
    postService({ body: { product_order_id: id } }).then(() => {
      call({
        params: {
          take: rowsPerPage,
          skip: (page - 1) * rowsPerPage,
          orderId,
        },
      });
    });
  };

  const handleDeleteService = (id: number) => {
    callDelete({ path: SALES_SERVICES_PATH.replace(':id', id.toString()) }).then(() => {
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
    callDelete({ path: REPAIR_ORDERS_PRODUCTS_PATH.replace(':id', orderId), body: [id] }).then(() => {
      call({
        params: {
          take: rowsPerPage,
          skip: (page - 1) * rowsPerPage,
          orderId,
        },
      });
    });
  };

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
    callPut({
      path: REPAIR_ORDERS_PRODUCTS_PATH.replace(':id', orderId),
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
            <Row
              onAddService={() => handleAddService(product.product_order.id)}
              onDeleteService={handleDeleteService}
              onDeleteProduct={handleDeleteProduct}
              onProductPropertyChange={handleProductPropertyChange}
              onServicePropertyChange={handleServicePropertyChange}
              key={product.id}
              product={product}
            />
          ))}
        </TableBody>
      </PaginatedTable>
      {showProductsModal && (<AddProductsModal orderId={orderId} onProductsAdded={handleProductsAdded} onClose={() => setShowProductsModal(false)} />)}
    </>
  );
}
