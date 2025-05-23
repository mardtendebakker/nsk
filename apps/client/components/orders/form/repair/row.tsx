import {
  Checkbox,
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
import can from '../../../../utils/can';
import useSecurity from '../../../../hooks/useSecurity';
import Can from '../../../can';

export default function Row({
  product,
  onAddService,
  onDeleteProduct,
  onDeleteService,
  onProductPropertyChange,
  onServicePropertyChange,
  checkedProductIds,
  onCheck,
  disabled,
}: {
  product: ProductListItem,
  onAddService: () => void,
  onDeleteProduct: (id: number) => void,
  onDeleteService: (id: number) => void,
  onProductPropertyChange: (payload: ProductListItem, property: string, value) => void,
  onServicePropertyChange: (payload: Service, property: string, value) => void,
  checkedProductIds: number[],
  onCheck: (object: { id: number, checked: boolean }) => void,
  disabled: boolean,
}) {
  const { state: { user } } = useSecurity();
  const { trans } = useTranslation();

  return (
    <>
      <TableRow>
        <TableCell>
          <Checkbox
            checked={Boolean(checkedProductIds.find((id) => id === product.id))}
            sx={{ mr: '1.5rem' }}
            onChange={(e, checked) => onCheck({ id: product.id, checked })}
            disabled={disabled}
          />
          {product.sku}
        </TableCell>
        <TableCell>{product.name}</TableCell>
        <TableCell>{product.type}</TableCell>
        <TableCell>{product.location}</TableCell>
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
            onChange={(e) => onProductPropertyChange(
              product,
              'price',
              e.target.value,
            )}
            disabled={!user || !can({ user, requiredGroups: ['admin', 'manager', 'logistics', 'local'] })}
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
            disabled={!user || !can({ user, requiredGroups: ['admin', 'manager', 'logistics', 'local'] })}
          />
        </TableCell>
        <TableCell align="right">
          <Can requiredGroups={['admin', 'manager', 'logistics', 'local']}>
            <AddButton title={trans('addService')} onClick={onAddService} />
            <Delete onClick={() => onDeleteProduct(product.id)} tooltip />
          </Can>
        </TableCell>
      </TableRow>
      {product.services && (
        <TableRow>
          <TableCell colSpan={9} sx={{ p: 0 }}>
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
                        disabled={!user || !can({ user, requiredGroups: ['admin', 'manager', 'logistics', 'local'] })}
                      />
                    </TableCell>
                    <TableCell colSpan={2}>
                      <Select
                        fullWidth
                        options={[
                          { title: trans('toDo'), value: '0' },
                          { title: trans('hold'), value: '1' },
                          { title: trans('done'), value: '3' },
                          { title: trans('cancel'), value: '4' },
                        ]}
                        onChange={(e) => user && can({ user, requiredGroups: ['admin', 'manager', 'logistics', 'local'] })
                          && onServicePropertyChange(service, 'status', e.target.value)}
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
                        disabled={!user || !can({ user, requiredGroups: ['admin', 'manager', 'logistics', 'local'] })}
                      />
                    </TableCell>
                    <TableCell>
                      <Can requiredGroups={['admin', 'manager', 'logistics', 'local']}>
                        <Delete onClick={() => onDeleteService(service.id)} tooltip />
                      </Can>
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
