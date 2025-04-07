import {
  Checkbox,
  TableRow,
} from '@mui/material';
import { useEffect, useState } from 'react';
import TextField from '../../../memoizedInput/textField';
import Delete from '../../../button/delete';
import TableCell from '../../../tableCell';
import can from '../../../../utils/can';
import Can from '../../../can';
import { ProductListItem } from '../../../../utils/axios/models/product';
import useSecurity from '../../../../hooks/useSecurity';

export default function Row({
  product,
  onProductPropertyChange,
  disabled,
  onRowChecked,
  checkedProductIds,
  onDeleteProduct,
  vatFactor,
}: {
  product: ProductListItem,
  onProductPropertyChange: (product: ProductListItem, property: string, value: any)=> void,
  disabled: boolean,
  onRowChecked: ({ id, checked }: { id: number, checked:boolean })=> void,
  checkedProductIds: number[],
  onDeleteProduct: (id: number)=> void,
  vatFactor: number,
}) {
  const { state: { user } } = useSecurity();
  const [price, setPrice] = useState(product.product_order.price.toString());
  const [priceInclVat, setPriceInclVat] = useState(product.product_order.price.toString());

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
        {product.sku}
      </TableCell>
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
          <Delete onClick={() => onDeleteProduct(product.id)} tooltip />
        </Can>
      </TableCell>
    </TableRow>
  );
}
