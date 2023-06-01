import {
  Box, Button, Dialog, DialogActions,
  DialogContent, DialogTitle,
  IconButton,
} from '@mui/material';
import Close from '@mui/icons-material/Close';
import useAxios from '../../../hooks/useAxios';
import useTranslation from '../../../hooks/useTranslation';
import useForm, { FormRepresentation } from '../../../hooks/useForm';
import Form, { buildAttributeKey } from '../form';
import { STOCK_PRODUCTS_PATH, STOCK_REPAIR_SERVICES_PATH } from '../../../utils/axios/paths';
import { Product } from '../../../utils/axios/models/product';

export function initFormState(product?: Product) {
  const attributes = {};

  product?.product_attributes?.forEach((productAttribute) => {
    const value = productAttribute.attribute.type == 2
      ? productAttribute.value.split(',')
      : productAttribute.value;

    attributes[buildAttributeKey({ id: productAttribute.attribute_id }, { id: product.product_type.id })] = {
      value,
    };
  });

  return {
    afile: { value: product?.afile },
    sku: { value: product?.sku },
    name: { value: product?.name, required: true },
    type_id: { value: product?.product_type?.id },
    location_id: { value: product?.location?.id, required: true },
    status_id: { value: product?.product_status?.id },
    price: { value: product?.price },
    description: { value: product?.description },
    ...attributes,
  };
}

export function formRepresentationToBody(formRepresentation: FormRepresentation): FormData {
  const formData = new FormData();
  let prIndex = 0;

  Object.keys(formRepresentation).forEach((key) => {
    if (key == 'afile') {
      return;
    }

    const value = formRepresentation[key].value || null;

    if (key.includes('attribute:') && formRepresentation.type_id.value >= 0) {
      const splitted = key.split(':');
      if (formRepresentation.type_id.value != splitted[1]) {
        return;
      }

      if (Array.isArray(value)) {
        value.forEach((subValue) => {
          formData.append(`files[${splitted[2]}]`, subValue);
        });
      } else {
        formData.append(`product_attributes[${prIndex}][attribute_id]`, splitted[2]);
        formData.append(`product_attributes[${prIndex}][value]`, value);
        prIndex += 1;
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

  const handleSave = (e) => {
    e.preventDefault();

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
      <form onSubmit={handleSave}>
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
          <Button type="submit" disabled={performing} onClick={handleSave} variant="contained" color="primary">{trans('saveChanges')}</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
