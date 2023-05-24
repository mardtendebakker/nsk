import {
  Box, Button, Dialog, DialogActions,
  DialogContent, DialogTitle,
  IconButton,
} from '@mui/material';
import Close from '@mui/icons-material/Close';
import { useMemo } from 'react';
import useTranslation from '../../../hooks/useTranslation';
import useForm from '../../../hooks/useForm';
import Form, { buildAttributeKey } from '../form';

export interface Product {
  id?: string | number,
  sku?: string,
  name?: string,
  productType?: number,
  location?: number,
  productStatus?: string,
  price?: number,
  description?: string,
  quantity?: number,
  attributes: { id: number, type:number, value: string | (string | File)[] }[]
}

function initFormState(product?: Product) {
  const attributes = {};

  product?.attributes?.forEach((attribute) => {
    attributes[buildAttributeKey(attribute, { id: product.productType })] = {
      value: attribute.value,
    };
  });

  return {
    sku: { value: product?.sku },
    name: { value: product?.name, required: true },
    productType: { value: product?.productType },
    location: { value: product?.location, required: true },
    productStatus: { value: product?.productStatus },
    price: { value: product?.price },
    quantity: { value: product?.quantity },
    description: { value: product?.description },
    ...attributes,
  };
}

export default function CreateModal(
  {
    onClose,
    onSubmit,
    product,
  }: {
    onClose: () => void,
    onSubmit: (product: Product) => void,
    product?: Product,
  },
) {
  const { trans } = useTranslation();
  const { formRepresentation, setValue, validate } = useForm(useMemo(() => initFormState(product), [product]));

  const handleSave = () => {
    if (validate()) {
      return;
    }

    const savedProduct: Product = { id: product?.id, attributes: [] };

    Object.keys(formRepresentation).forEach((key) => {
      const { value } = formRepresentation[key];

      if (value == undefined) {
        return;
      }

      if (key.includes('attribute:') && formRepresentation.productType.value >= 0) {
        const splitted = key.split(':');
        if (formRepresentation.productType.value != splitted[2]) {
          return;
        }

        savedProduct.attributes.push({
          id: parseInt(splitted[3], 10),
          type: parseInt(splitted[1], 10),
          value,
        });
      } else {
        savedProduct[key] = value;
      }
    });

    onSubmit(savedProduct);
  };

  return (
    <Dialog open onClose={onClose} maxWidth={false}>
      <DialogTitle>
        <Box sx={{ justifyContent: 'space-between', alignItems: 'center', display: 'flex' }}>
          {trans('createProduct')}
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Form setValue={setValue} formRepresentation={formRepresentation} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined" color="inherit">{trans('cancel')}</Button>
        <Button onClick={handleSave} variant="contained" color="primary">{trans('saveChanges')}</Button>
      </DialogActions>
    </Dialog>
  );
}

CreateModal.defaultProps = { product: undefined };
