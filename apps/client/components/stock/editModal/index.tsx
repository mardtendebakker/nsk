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
import { STOCK_PRODUCTS_PATH, STOCK_REPAIR_SERVICES_PATH } from '../../../utils/axios/paths';
import useAxios from '../../../hooks/useAxios';
import { formRepresentationToBody, initFormState } from '../createModal';

export default function EditModal(
  {
    onClose,
    onSubmit,
    id,
    type,
  }: {
    onClose: () => void,
    onSubmit: () => void,
    id: string,
    type: 'product' | 'repair'
  },
) {
  const { trans } = useTranslation();

  const ajaxPath = type == 'product' ? STOCK_PRODUCTS_PATH : STOCK_REPAIR_SERVICES_PATH;

  const { data: product, call, performing } = useAxios(
    'get',
    ajaxPath.replace(':id', id),
    {
      showErrorMessage: true,
    },
  );

  const { call: callPut, performing: performingPut } = useAxios(
    'put',
    ajaxPath.replace(':id', id),
    {
      showErrorMessage: true,
    },
  );

  const { formRepresentation, setValue, validate } = useForm(useMemo(() => initFormState(product), [product]));

  useEffect(() => {
    call().catch(onClose);
  }, []);

  const handleSave = (e) => {
    e.preventDefault();

    if (validate()) {
      return;
    }

    callPut({
      body: formRepresentationToBody(formRepresentation),
      headers: { 'Content-Type': 'multipart/form-data' },
    })
      .then(onSubmit);
  };

  const canSubmit = () => !performing && !performingPut;

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
          <Button disabled={!canSubmit()} onClick={onClose} variant="outlined" color="inherit">{trans('cancel')}</Button>
          <Button type="submit" disabled={!canSubmit()} onClick={handleSave} variant="contained" color="primary">{trans('saveChanges')}</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
