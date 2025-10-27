import {
  TableRow,
  Checkbox,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { ProductListItem } from '../../../../utils/axios/models/product';
import TextField from '../../../memoizedInput/textField';
import Edit from '../../../button/edit';
import TableCell from '../../../tableCell';
import can from '../../../../utils/can';
import Can from '../../../can';
import useSecurity from '../../../../hooks/useSecurity';

export default function Row({
  product,
  onProductPropertyChange,
  disabled,
  onRowChecked,
  checkedProductIds,
  onEditProduct,
  vatFactor,
}: {
  product: ProductListItem,
  onProductPropertyChange: (product: ProductListItem, property: string, value: any)=> void,
  disabled: boolean,
  onRowChecked: ({ id, checked }: { id: number, checked:boolean })=> void,
  checkedProductIds: number[],
  onEditProduct: (id: number)=> void,
  vatFactor: number,
}) {
  const { state: { user } } = useSecurity();
  const [price, setPrice] = useState(product.product_order.price?.toString() || '0');
  const [priceInclVat, setPriceInclVat] = useState(product.product_order.price?.toString() || '0');

  useEffect(() => {
    setPriceInclVat((product.product_order.price * vatFactor).toString());
  }, [vatFactor]);
  return (
    <TableRow key={product.id}>
      <TableCell>
        <Checkbox
          checked={Boolean(checkedProductIds.find((id) => id === product.id))}
          sx={{ mr: '1.5rem' }}
          onChange={(e, checked) => onRowChecked({ id: product.id, checked })}
          disabled={disabled}
        />
        {product.id}
      </TableCell>
      <TableCell>{product.sku}</TableCell>
      <TableCell>{product.name}</TableCell>
      <TableCell>{product.type}</TableCell>
      <TableCell>{product.location}</TableCell>
      <TableCell>
        {product.price}
      </TableCell>
      <TableCell>
        <TextField
          type="number"
          placeholder="1"
          value={price}
          onChange={(e) => {
            setPrice(e.target.value);
            setPriceInclVat((parseFloat(e.target.value) * vatFactor).toString());
            onProductPropertyChange(
              product,
              'price',
              e.target.value,
            );
          }}
          disabled={!user || !can({ user, requiredGroups: ['admin', 'manager', 'logistics', 'local'] })}
        />
      </TableCell>
      <TableCell>
        <TextField
          type="number"
          placeholder="1"
          value={priceInclVat}
          onChange={(e) => {
            setPrice((parseFloat(e.target.value) / vatFactor).toString());
            setPriceInclVat(e.target.value);
            onProductPropertyChange(
              product,
              'price',
              parseFloat(e.target.value) / vatFactor,
            );
          }}
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
          <Edit onClick={() => onEditProduct(product.id)} />
        </Can>
      </TableCell>
    </TableRow>
  );
}
