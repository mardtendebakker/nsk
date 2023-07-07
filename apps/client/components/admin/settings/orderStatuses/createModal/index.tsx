import {
  Box, Button, Dialog, DialogActions,
  DialogContent, DialogTitle,
  IconButton,
} from '@mui/material';
import Close from '@mui/icons-material/Close';
import useAxios from '../../../../../hooks/useAxios';
import useTranslation from '../../../../../hooks/useTranslation';
import useForm, { FormRepresentation } from '../../../../../hooks/useForm';
import Form from '../form';
import { ORDER_STATUSES_PATH } from '../../../../../utils/axios';
import { OrderStatus } from '../../../../../utils/axios/models/order';

export function initFormState(orderStatus?: OrderStatus) {
  return {
    name: { value: orderStatus?.name, required: true },
    color: { value: orderStatus?.color },
    isSale: { value: orderStatus?.is_sale || false },
    isPurchase: { value: orderStatus?.is_purchase || false },
    mailBody: { value: orderStatus?.mailbody },
  };
}

export function formRepresentationToBody(formRepresentation: FormRepresentation) {
  return {
    name: formRepresentation.name.value,
    color: formRepresentation.color.value,
    is_sale: formRepresentation.isSale.value,
    is_purchase: formRepresentation.isPurchase.value,
    mailbody: formRepresentation.mailBody.value,
  };
}

const formState = initFormState();

export default function CreateModal({ onClose, onSubmit }: {
  onClose: () => void,
  onSubmit: () => void,
}) {
  const { trans } = useTranslation();
  const { formRepresentation, setValue, validate } = useForm(formState);

  const { call, performing } = useAxios('post', ORDER_STATUSES_PATH.replace(':id', ''));

  const handleSave = (e) => {
    e.preventDefault();

    if (validate()) {
      return;
    }

    call({ body: formRepresentationToBody(formRepresentation) })
      .then(onSubmit);
  };

  return (
    <Dialog open onClose={onClose} maxWidth={false}>
      <form onSubmit={handleSave}>
        <DialogTitle>
          <Box sx={{ justifyContent: 'space-between', alignItems: 'center', display: 'flex' }}>
            {trans('createOrderStatus')}
            <IconButton onClick={onClose} disabled={performing}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Form setValue={setValue} formRepresentation={formRepresentation} disabled={performing} />
        </DialogContent>
        <DialogActions>
          <Button size="small" disabled={performing} onClick={onClose} variant="outlined" color="inherit">{trans('cancel')}</Button>
          <Button size="small" type="submit" disabled={performing} onClick={handleSave} variant="contained" color="primary">{trans('save')}</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
