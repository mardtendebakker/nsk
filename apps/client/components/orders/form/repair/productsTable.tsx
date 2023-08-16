import {
  Box,
  Button,
  Table,
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
import { STOCK_REPAIRS_PATH, SERVICES_PATH } from '../../../../utils/axios';
import AddButton from '../../../button/add';
import Select from '../../../memoizedInput/select';
import Delete from '../../../button/delete';
import PaginatedTable from '../../../paginatedTable';
import TableCell from '../../../tableCell';
import AddProductsModal from '../addProductsModal';

function Row({
  product,
  onAddService,
  onDeleteService,
  onProductPropertyChange,
  onServicePropertyChange,
}: {
  product: ProductListItem,
  onAddService: () => void,
  onDeleteService: (id: number) => void,
  onProductPropertyChange: (payload: object, property: string, value) => void,
  onServicePropertyChange: (payload: object, property: string, value) => void,
}) {
  const { trans } = useTranslation();

  return (
    <>
      <TableRow>
        <TableCell>{product.sku}</TableCell>
        <TableCell>{product.name}</TableCell>
        <TableCell>{product.type}</TableCell>
        <TableCell>
          {product.retailPrice}
        </TableCell>
        <TableCell>
          <TextField
            type="number"
            placeholder="1"
            defaultValue={product.product_order.price.toString()}
            onChange={(e) => onProductPropertyChange(
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
            defaultValue={product.stock.toString()}
            onChange={(e) => onProductPropertyChange(
              product,
              'quantity',
              e.target.value,
            )}
          />
        </TableCell>
        <TableCell>
          <AddButton title={trans('addService')} onClick={onAddService} />
          <Delete onDelete={() => {}} tooltip />
        </TableCell>
      </TableRow>
      {product.services && (
        <TableRow>
          <TableCell colSpan={8} sx={{ p: 0 }}>
            <Table sx={{ borderRadius: 0 }} size="small">
              <TableHead>
                <TableRow>
                  <TableCell colSpan={3}>{trans('serviceDescription')}</TableCell>
                  <TableCell colSpan={2}>{trans('status')}</TableCell>
                  <TableCell>{trans('price')}</TableCell>
                  <TableCell>{trans('actions')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {product.services.map((service) => (
                  <TableRow sx={(theme) => ({ backgroundColor: theme.palette.grey[10] })} key={service.id}>
                    <TableCell colSpan={3}>
                      <TextField
                        defaultValue={service.description}
                        fullWidth
                        placeholder={trans('serviceDescription')}
                        onChange={(e) => onServicePropertyChange(
                          product,
                          'description',
                          e.target.value,
                        )}
                      />
                    </TableCell>
                    <TableCell colSpan={2}>
                      <Select
                        fullWidth
                        options={[
                          { title: trans('todo'), value: '0' },
                          { title: trans('hold'), value: '1' },
                          { title: trans('done'), value: '3' },
                          { title: trans('cancel'), value: '4' },
                        ]}
                        onChange={(e) => onServicePropertyChange(product, 'status', e.target.value)}
                        value="1"
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        placeholder="0.00"
                        defaultValue={service.price?.toString()}
                        onChange={(e) => onServicePropertyChange(
                          product,
                          'price',
                          e.target.value,
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <Delete onDelete={() => onDeleteService(service.id)} tooltip />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

export default function ProductsTable({ orderId }:{ orderId: string }) {
  const { trans } = useTranslation();
  const [showProductsModal, setShowProductsModal] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);

  const { call: callPut } = useAxios('put', undefined, { withProgressBar: true });
  const { call: postService } = useAxios('post', SERVICES_PATH.replace(':id', ''), { withProgressBar: true });
  const { call: deleteService } = useAxios('delete', undefined, { withProgressBar: true });
  const { data: { data = [], count = 0 } = {}, call } = useAxios(
    'get',
    STOCK_REPAIRS_PATH.replace(':id', ''),
    {
      withProgressBar: true,
    },
  );

  const handleProductPropertyChange = useCallback(debounce((product, property: string, value) => {
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

  const handleServicePropertyChange = useCallback(debounce((service, property: string, value) => {
    callPut({
      path: SERVICES_PATH.replace(':id', service.id.toString()),
      body: { [property]: value },
    });
  }), []);

  const handleAddService = () => {
    postService().then(() => {
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
    deleteService({ path: SERVICES_PATH.replace(':id', id.toString()) }).then(() => {
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
    // TODO add products to the order
    setShowProductsModal(false);
    call({
      params: {
        take: rowsPerPage,
        skip: (page - 1) * rowsPerPage,
        orderId,
      },
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
              onAddService={handleAddService}
              onDeleteService={handleDeleteService}
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
