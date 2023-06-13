import {
  Box, Button, Dialog, DialogActions,
  DialogContent, DialogTitle,
  IconButton,
} from '@mui/material';
import Close from '@mui/icons-material/Close';
import { useEffect, useMemo } from 'react';
import useAxios from '../../../../../hooks/useAxios';
import useTranslation from '../../../../../hooks/useTranslation';
import useForm from '../../../../../hooks/useForm';
import Form from '../form';
import { LOCATIONS_PATH } from '../../../../../utils/axios';
import { initFormState, formRepresentationToBody } from '../createModal';

export default function EditModal({ onClose, onSubmit, id }: {
  onClose: () => void,
  onSubmit: () => void,
  id: string,
}) {
  const { trans } = useTranslation();

  const { data: location, call, performing } = useAxios('get', LOCATIONS_PATH.replace(':id', id));
  const { call: callPut, performing: performingPut } = useAxios('put', LOCATIONS_PATH.replace(':id', id));
  const { formRepresentation, setValue, validate } = useForm(useMemo(() => initFormState(location), [location]));

  useEffect(() => {
    call().catch(onClose);
  }, []);

  const canSubmit = () => !performing && !performingPut;

  const handleSave = (e) => {
    e.preventDefault();

    if (validate() && !canSubmit()) {
      return;
    }

    callPut({ body: formRepresentationToBody(formRepresentation) })
      .then(onSubmit);
  };

  return (
    <Dialog open onClose={onClose} maxWidth={false}>
      <form onSubmit={handleSave}>
        <DialogTitle>
          <Box sx={{ justifyContent: 'space-between', alignItems: 'center', display: 'flex' }}>
            {trans('editLocation')}
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
          <Button type="submit" disabled={performing} onClick={handleSave} variant="contained" color="primary">{trans('save')}</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
