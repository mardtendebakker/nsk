import {
  Box, Button, Dialog, DialogActions,
  DialogContent, DialogTitle,
  IconButton,
} from '@mui/material';
import Close from '@mui/icons-material/Close';
import { useEffect, useMemo } from 'react';
import useTranslation from '../../../hooks/useTranslation';
import useForm from '../../../hooks/useForm';
import Form from '../form';
import { STOCK_PRODUCTS_PATH } from '../../../utils/axios';
import useAxios from '../../../hooks/useAxios';
import { formRepresentationToBody, initFormState } from '../createModal';

export default function EditModal(
  {
    onClose,
    onSubmit,
    id,
  }: {
    onClose: () => void,
    onSubmit: () => void,
    id: string,
  },
) {
  const { trans } = useTranslation();

  const { data: product, call, performing } = useAxios('get', STOCK_PRODUCTS_PATH.replace(':id', id));

  const { call: callPut, performing: performingPut } = useAxios('put', STOCK_PRODUCTS_PATH.replace(':id', id));

  const { formRepresentation, setValue, validate } = useForm(useMemo(() => initFormState(product), [product]));

  useEffect(() => {
    call().catch(onClose);
  }, []);

  const canSubmit = () => !performing && !performingPut;

  const handleSave = (e) => {
    e.preventDefault();

    if (validate() && !canSubmit()) {
      return;
    }

    callPut({
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
            {trans('editProduct')}
            <IconButton onClick={onClose} disabled={!canSubmit()}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Form setValue={setValue} formRepresentation={formRepresentation} disabled={!canSubmit()} />
        </DialogContent>
        <DialogActions>
          <Button size="small" disabled={!canSubmit()} onClick={onClose} variant="outlined" color="inherit">{trans('cancel')}</Button>
          <Button size="small" type="submit" disabled={!canSubmit()} onClick={handleSave} variant="contained" color="primary">{trans('save')}</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
