import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  useState, useEffect, useCallback,
} from 'react';
import Add from '@mui/icons-material/Add';
import { useRouter } from 'next/router';
import { ProductListItem } from '../../../utils/axios/models/product';
import debounce from '../../../utils/debounce';
import TextField from '../../memoizedInput/textField';
import CreateModal from '../../stock/createModal';
import useTranslation from '../../../hooks/useTranslation';
import useAxios from '../../../hooks/useAxios';
import { ORDERS_PURCHASES } from '../../../utils/routes';
import { STOCK_PRODUCTS_PATH, STOCK_REPAIR_SERVICES_PATH } from '../../../utils/axios';
import EditModal from '../../stock/editModal';

export default function ProductsTable({ orderId }:{ orderId: string }) {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editProductId, setEditProductId] = useState<number | undefined>();
  const router = useRouter();

  const { trans } = useTranslation();

  const ajaxPath = router.pathname.includes(ORDERS_PURCHASES) ? STOCK_PRODUCTS_PATH : STOCK_REPAIR_SERVICES_PATH;
  const type = router.pathname.includes(ORDERS_PURCHASES) ? 'product' : 'repair';

  const { data: { data = [] } = {}, call } = useAxios(
    'get',
    ajaxPath.replace(':id', ''),
    {
      withProgressBar: true,
    },
  );

  const { call: callPut } = useAxios('patch', undefined, { withProgressBar: true });

  const handleProductPropertyChange = useCallback(debounce((product, property: string, value) => {
    callPut({
      path: ajaxPath.replace(':id', product.id.toString()),
      body: { [property]: value },
    });
  }), []);

  useEffect(() => {
    call({ params: { orderId } });
  }, [orderId]);

  return (
    <>
      <Table>
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
              {trans('retailUnitPrice')}
            </TableCell>
            <TableCell>
              {trans('purchaseUnitPrice')}
            </TableCell>
            <TableCell>
              {trans('purchaseQuantity')}
            </TableCell>
            <TableCell>
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
                  {product.retailPrice}
                </TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    placeholder="0.00"
                    defaultValue={product.price.toString()}
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
                    defaultValue={product.stock.toString()}
                    onChange={(e) => handleProductPropertyChange(
                      product,
                      'stock',
                      e.target.value,
                    )}
                  />
                </TableCell>
                <TableCell>
                  <Button onClick={() => setEditProductId(product.id)}>
                    {trans('edit')}
                  </Button>
                </TableCell>
              </TableRow>
            ),
          )}
          <TableRow>
            <TableCell>
              <Button onClick={() => setShowForm(true)}>
                <Add />
                {trans('addAnotherProduct')}
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      {showForm && <CreateModal type={type} onClose={() => setShowForm(false)} onSubmit={() => { call({ params: { orderId } }); setShowForm(false); }} />}
      {editProductId && <EditModal type={type} id={editProductId.toString()} onClose={() => setEditProductId(undefined)} onSubmit={() => setEditProductId(undefined)} />}
    </>
  );
}
