import {
  Box, Button, Dialog, DialogActions,
  DialogContent, DialogTitle,
  IconButton,
} from '@mui/material';
import Close from '@mui/icons-material/Close';
import useTranslation from '../../../hooks/useTranslation';
import useForm from '../../../hooks/useForm';
import Form from '../form';

export default function CreateProductModal({ onClose, onSubmit }: { onClose: () => void, onSubmit: (formData: FormData) => void }) {
  const { trans } = useTranslation();
  const { formRepresentation, setValue, validate } = useForm({
    sku: {
      value: '',
    },
    name: {
      value: '',
      required: true,
    },
    productType: {
      value: undefined,
    },
    location: {
      value: undefined,
      required: true,
    },
    productStatus: {
      value: undefined,
    },
    price: {
      value: '',
    },
  });

  const handleSave = () => {
    if (validate()) {
      return;
    }

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

        formData.append(`attributes[${splitted[3]}]`, value);
      } else {
        formData.append(key, value);
      }
    });

    onSubmit(formData);
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
