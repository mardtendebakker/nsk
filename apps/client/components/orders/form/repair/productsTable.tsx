import {
  Box,
  Button,
  TableBody,
  TableHead,
  TableRow,
} from '@mui/material';
import { useEffect, useCallback, useState } from 'react';
import Add from '@mui/icons-material/Add';
import { useRouter } from 'next/router';
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
import Can from '../../../can';
import useForm, { FieldPayload } from '../../../../hooks/useForm';
import { getQueryParam } from '../../../../utils/location';
import initFormState from '../productsInitFormState';
import Filter from '../../../stock/list/filter';
import refreshList from '../productsRefreshList';

export default function ProductsTable({ orderId, refreshOrder }:{ orderId: string, refreshOrder: () => void }) {
  const { trans } = useTranslation();
  const router = useRouter();
  const [showProductsModal, setShowProductsModal] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);

  const { formRepresentation, setValue, setData } = useForm(initFormState({
    search: getQueryParam('search'),
    productType: getQueryParam('productType'),
    location: getQueryParam('location'),
    locationLabel: getQueryParam('locationLabel'),
    productStatus: getQueryParam('productStatus'),
    orderId,
  }));

  const { call: callPut, performing: performingPut } = useAxios('put', undefined);
  const { call: callPutWithProgressBar, performing: performingPutWithProgressBar } = useAxios('put', undefined, { withProgressBar: true });
  const { call: postService, performing: performingPost } = useAxios('post', SALES_SERVICES_PATH.replace(':id', ''), { showSuccessMessage: true, withProgressBar: true });
  const { call: callDelete, performing: performingDelete } = useAxios('delete', undefined, { withProgressBar: true, showSuccessMessage: true });
  const { data: { data = [], count = 0 } = {}, call, performing } = useAxios<undefined | { data?: ProductListItem[], count?: number }>(
    'get',
    APRODUCT_PATH.replace(':id', ''),
    {
      withProgressBar: true,
      defaultParams: {
        orderBy: JSON.stringify({ order_updated_at: 'desc' }),
      },
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
    }).then(() => {
      refreshOrder();
    });
  }), []);

  const handleServicePropertyChange = useCallback(debounce((service: Service, property: string, value) => {
    callPut({
      path: SALES_SERVICES_PATH.replace(':id', service.id.toString()),
      body: { [property]: value },
    }).then(() => {
      refreshOrder();
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

  const defaultRefreshList = () => refreshList({
    page,
    rowsPerPage,
    formRepresentation,
    router,
    call,
  });

  useEffect(() => {
    defaultRefreshList();
  }, [
    page,
    rowsPerPage,
    formRepresentation.search.value,
    formRepresentation.productType.value?.toString(),
    formRepresentation.productStatus.value?.toString(),
    formRepresentation.location.value?.toString(),
    formRepresentation.locationLabel.value?.toString(),
  ]);

  const handleProductsAdded = (productIds: number[]) => {
    callPutWithProgressBar({
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

  const handleReset = () => {
    setData(initFormState({ orderId }));
    setPage(1);
  };

  const disabled = (): boolean => performing || performingPut || performingPutWithProgressBar || performingPost || performingDelete;

  return (
    <>
      <Can requiredGroups={['manager', 'logistics', 'local']}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button size="small" onClick={() => setShowProductsModal(true)} sx={{ mb: '.5rem' }}>
            <Add />
            {trans('addProducts')}
          </Button>
        </Box>
      </Can>
      <Filter
        onReset={handleReset}
        disabled={disabled()}
        formRepresentation={formRepresentation}
        setValue={(payload: FieldPayload) => {
          setValue(payload);
          setPage(1);
        }}
      />
      <Box sx={{ m: '.5rem' }} />
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
              {trans('location')}
            </TableCell>
            <TableCell>
              {trans('retailPrice')}
            </TableCell>
            <TableCell>
              {trans('stockQuantity')}
            </TableCell>
            <TableCell>
              {trans('salePrice')}
            </TableCell>
            <TableCell>
              {trans('quantity')}
            </TableCell>
            <TableCell align="right">
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
