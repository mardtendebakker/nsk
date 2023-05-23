import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import { useState, Dispatch, SetStateAction } from 'react';
import Add from '@mui/icons-material/Add';
import TextField from '../../memoizedInput/textField';
import CreateModal, { Product } from '../../stock/createModal';
import useTranslation from '../../../hooks/useTranslation';

export default function ProductsTable(
  { products, setProducts }:
  { products: { [key:number]: Product }, setProducts: Dispatch<SetStateAction< { [key:number]: Product }>> },
) {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [productToEdit, setProductToEdit] = useState<Product | undefined>();
  const { trans } = useTranslation();

  const handleProductPropertyChange = (product: Product, property: string, value) => {
    products[product.id][property] = value;
    setProducts({ ...products });
  };

  const handleNewProduct = (product: Product) => {
    product.id = `new${Math.random()}`;
    product.price = 0;
    product.quantity = 1;
    products[product.id] = product;
    setProducts(products);
    setShowForm(false);
  };

  const handleEditProduct = (product: Product) => {
    products[product.id] = product;
    setProducts(products);
    setProductToEdit(undefined);
  };

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
          {Object.keys(products).map(
            (key) => (
              <TableRow key={key}>
                <TableCell>{products[key].id?.includes('new') ? '--' : products[key].id}</TableCell>
                <TableCell>{products[key].sku}</TableCell>
                <TableCell>{products[key].name}</TableCell>
                <TableCell>{products[key].productType}</TableCell>
                <TableCell>
                  UNKNOWN
                </TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    placeholder="0.00"
                    value={products[key].price.toString()}
                    onChange={(e) => handleProductPropertyChange(
                      products[key],
                      'price',
                      e.target.value,
                    )}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    placeholder="1"
                    value={products[key].quantity.toString()}
                    onChange={(e) => handleProductPropertyChange(
                      products[key],
                      'quantity',
                      e.target.value,
                    )}
                  />
                </TableCell>
                <TableCell>
                  <Button onClick={() => setProductToEdit(products[key])}>
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
      {showForm && <CreateModal onClose={() => setShowForm(false)} onSubmit={handleNewProduct} />}
      {productToEdit && <CreateModal product={productToEdit} onClose={() => setProductToEdit(undefined)} onSubmit={handleEditProduct} />}
    </>
  );
}
