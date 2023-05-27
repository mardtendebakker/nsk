import {
  Box, Button, Dialog, DialogActions,
  DialogContent, DialogTitle,
  IconButton,
} from '@mui/material';
import Close from '@mui/icons-material/Close';
import useAxios from '../../../hooks/useAxios';
import useTranslation from '../../../hooks/useTranslation';
import useForm, { FormRepresentation } from '../../../hooks/useForm';
import Form/* , { buildAttributeKey } */ from '../form';
import { STOCK_PRODUCTS_PATH, STOCK_REPAIR_SERVICES_PATH } from '../../../utils/axios/paths';
import { Product } from '../../../utils/axios/models/product';

export function initFormState(product?: Product) {
  const attributes = {};

  /* product?.attributes?.forEach((attribute) => {
    attributes[buildAttributeKey(attribute, { id: product.productType })] = {
      value: attribute.value,
    };
  }); */

  return {
    sku: { value: product?.sku },
    name: { value: product?.name, required: true },
    productType: { value: product?.product_type?.id },
    location: { value: product?.location?.id, required: true },
    productStatus: { value: product?.product_status?.id },
    price: { value: product?.price },
    description: { value: product?.description },
    ...attributes,
  };
}

export function formRepresentationToBody(formRepresentation: FormRepresentation): FormData {
  const formData = new FormData();

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

      if (Array.isArray(value)) {
        value.forEach((subValue) => {
          formData.append(`attributes[${splitted[3]}][]`, subValue);
        });
      } else {
        formData.append(`attributes[${splitted[3]}]`, value);
      }
    } else {
      formData.append(key, value);
    }
  });

  return formData;
}

const formState = initFormState();

export default function CreateModal({ onClose, onSubmit, type }: {
  onClose: () => void,
  onSubmit: () => void,
  type: 'product' | 'repair'
}) {
  const { trans } = useTranslation();
  const { formRepresentation, setValue, validate } = useForm(formState);

  const ajaxPath = type == 'product' ? STOCK_PRODUCTS_PATH : STOCK_REPAIR_SERVICES_PATH;

  const { call, performing } = useAxios(
    'post',
    ajaxPath.replace(':id', ''),
    {
      showErrorMessage: true,
    },
  );

  const handleSave = () => {
    if (validate()) {
      return;
    }

    call({
      body: formRepresentationToBody(formRepresentation),
      headers: { 'Content-Type': 'multipart/form-data' },
    })
      .then(onSubmit);
  };

  return (
    <Dialog open onClose={onClose} maxWidth={false}>
      <DialogTitle>
        <Box sx={{ justifyContent: 'space-between', alignItems: 'center', display: 'flex' }}>
          {trans('createProduct')}
          <IconButton onClick={onClose} disabled={performing}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Form setValue={setValue} formRepresentation={formRepresentation} disabled={performing} />
      </DialogContent>
      <DialogActions>
        <Button disabled={performing} onClick={onClose} variant="outlined" color="inherit">{trans('cancel')}</Button>
        <Button disabled={performing} onClick={handleSave} variant="contained" color="primary">{trans('saveChanges')}</Button>
      </DialogActions>
    </Dialog>
  );
}
