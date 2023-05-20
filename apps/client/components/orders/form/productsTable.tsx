import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import { useState } from 'react';
import Add from '@mui/icons-material/Add';
import { FormRepresentation, SetValue } from '../../../hooks/useForm';
import TextField from '../../memoizedInput/textField';
import CreateModal from '../../stock/createModal';
import useTranslation from '../../../hooks/useTranslation';

export default function ProductsTable(
  { formRepresentation, setValue }:
  { formRepresentation: FormRepresentation, setValue: SetValue },
) {
  const [showForm, setShowForm] = useState<boolean>(false);
  const { trans } = useTranslation();

  const handleProductPropertyChange = (product, property, value) => {
    const productToUpdate = formRepresentation.products.value.find(
      ({ id, tempId }) => product.id == id || product.tempId == tempId,
    );

    productToUpdate[property] = value;

    setValue({ field: 'products', value: formRepresentation.products.value });
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
          </TableRow>
        </TableHead>
        <TableBody>
          {/* formRepresentation.products.value.map(
            (product) => (
              <TableRow key={product.id || product.tempId}>
                <TableCell>{product.id || '--'}</TableCell>
                <TableCell>{product.sku}</TableCell>
                <TableCell>{product.productName}</TableCell>
                <TableCell>{product.productType}</TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    placeholder="0.00"
                    value={product.retailUnitPrice}
                    onChange={(e) => handleProductPropertyChange(
                      product,
                      'retailUnitPrice',
                      e.target.value,
                    )}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    placeholder="0.00"
                    value={product.purchaseUnitPrice}
                    onChange={(e) => handleProductPropertyChange(
                      product,
                      'purchaseUnitPrice',
                      e.target.value,
                    )}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    placeholder="0.00"
                    value={product.purchaseQuantity}
                    onChange={(e) => handleProductPropertyChange(
                      product,
                      'purchaseQuantity',
                      e.target.value,
                    )}
                  />
                </TableCell>
              </TableRow>
            ),
                    ) */}
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
      {showForm && <CreateModal onClose={() => setShowForm(false)} onSubmit={console.log} />}
    </>
  );
}
