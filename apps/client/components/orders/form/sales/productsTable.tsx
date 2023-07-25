import {
  Button,
  Table,
  TableBody,
  TableCell,
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
import { STOCK_REPAIRS_PATH, SERVICES_PATH, STOCK_PRODUCTS_PATH } from '../../../../utils/axios';
import AddButton from '../../../button/add';
import Select from '../../../memoizedInput/select';
import Delete from '../../../button/delete';
import DataSourcePicker from '../../../memoizedInput/dataSourcePicker';
import ConfirmationDialog from '../../../confirmationDialog';

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
            placeholder="0.00"
            defaultValue={product.price.toString()}
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
              'stock',
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
                  <TableCell colSpan={3}>{trans('serviceName')}</TableCell>
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
                        defaultValue={service.name}
                        fullWidth
                        placeholder={trans('serviceName')}
                        onChange={(e) => onServicePropertyChange(
                          product,
                          'name',
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
                        defaultValue={service.price.toString()}
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

function AddProductModal({
  onClose,
  onProductAdded,
  open,
}:{
  onClose: ()=>void,
  onProductAdded: () => void,
  open: boolean
}) {
  const { trans } = useTranslation();
  const [productId, setProductId] = useState<number | undefined>();

  const handleConfirm = () => {
    // TODO call api to add product
    onProductAdded();
  };

  // TODO update when api call is done
  const disabled = () => !productId;

  return (
    <ConfirmationDialog
      open={open}
      disabled={disabled()}
      title={<>{trans('addProduct')}</>}
      onClose={onClose}
      onConfirm={handleConfirm}
      content={(
        <DataSourcePicker
          url={STOCK_PRODUCTS_PATH.replace(':id', '')}
          label={trans('product')}
          placeholder={trans('selectProduct')}
          onChange={(value: { id: number }) => setProductId(value?.id)}
          value={productId?.toString() || ''}
        />
      )}
    />
  );
}

export default function ProductsTable({ orderId }:{ orderId: string }) {
  const { trans } = useTranslation();
  const [showServicePicker, setShowServicePicker] = useState(false);

  const { call: callPut } = useAxios('patch', undefined, { withProgressBar: true });
  const { call: postService } = useAxios('post', SERVICES_PATH.replace(':id', ''), { withProgressBar: true });
  const { call: deleteService } = useAxios('delete', undefined, { withProgressBar: true });
  const { data: { data = [] } = {}, call } = useAxios(
    'get',
    STOCK_REPAIRS_PATH.replace(':id', ''),
    {
      withProgressBar: true,
    },
  );

  const handleProductPropertyChange = useCallback(debounce((product, property: string, value) => {
    callPut({
      path: STOCK_REPAIRS_PATH.replace(':id', product.id.toString()),
      body: { [property]: value },
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
      call({ params: { orderId } });
    });
  };

  const handleDeleteService = (id: number) => {
    deleteService({ path: SERVICES_PATH.replace(':id', id.toString()) }).then(() => {
      call({ params: { orderId } });
    });
  };

  useEffect(() => {
    call({ params: { orderId } });
  }, [orderId]);

  return (
    <>
      <Table size="small">
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
          <TableRow>
            <TableCell>
              <Button size="small" onClick={() => setShowServicePicker(true)}>
                <Add />
                {trans('addAnotherProduct')}
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <AddProductModal
        open={showServicePicker}
        onProductAdded={() => {
          setShowServicePicker(false);
          call({ params: { orderId } });
        }}
        onClose={() => setShowServicePicker(false)}
      />
    </>
  );
}
