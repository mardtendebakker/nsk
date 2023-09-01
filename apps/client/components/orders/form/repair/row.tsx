import {
  Table,
  TableBody,
  TableHead,
  TableRow,
} from '@mui/material';
import { ProductListItem, Service } from '../../../../utils/axios/models/product';
import TextField from '../../../memoizedInput/textField';
import useTranslation from '../../../../hooks/useTranslation';
import AddButton from '../../../button/add';
import Select from '../../../memoizedInput/select';
import Delete from '../../../button/delete';
import TableCell from '../../../tableCell';

export default function Row({
  product,
  onAddService,
  onDeleteProduct,
  onDeleteService,
  onProductPropertyChange,
  onServicePropertyChange,
}: {
  product: ProductListItem,
  onAddService: () => void,
  onDeleteProduct: (id: number) => void,
  onDeleteService: (id: number) => void,
  onProductPropertyChange: (payload: ProductListItem, property: string, value) => void,
  onServicePropertyChange: (payload: Service, property: string, value) => void,
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
          {product.stock}
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
            defaultValue={product.product_order.quantity.toString()}
            onChange={(e) => onProductPropertyChange(
              product,
              'quantity',
              e.target.value,
            )}
          />
        </TableCell>
        <TableCell>
          <AddButton title={trans('addService')} onClick={onAddService} />
          <Delete onDelete={() => onDeleteProduct(product.id)} tooltip />
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
                          service,
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
                        onChange={(e) => onServicePropertyChange(service, 'status', e.target.value)}
                        defaultValue={service.status.toString()}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        placeholder="0.00"
                        defaultValue={service.price?.toString()}
                        onChange={(e) => onServicePropertyChange(
                          service,
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