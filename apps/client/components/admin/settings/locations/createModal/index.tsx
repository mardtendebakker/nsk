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
import { LOCATIONS_PATH } from '../../../../../utils/axios';
import { Location } from '../../../../../utils/axios/models/location';

export function initFormState(location?: Location) {
  return {
    name: { value: location?.name, required: true },
    zipcodes: { value: location?.zipcodes?.split(',') },
  };
}

export function formRepresentationToBody(formRepresentation: FormRepresentation) {
  let zipcodes = null;

  if (formRepresentation.zipcodes.value && formRepresentation.zipcodes.value.length > 0) {
    zipcodes = formRepresentation.zipcodes.value.join(',');
  }

  return {
    name: formRepresentation.name.value,
    zipcodes,
  };
}

const formState = initFormState();

export default function CreateModal({ onClose, onSubmit }: {
  onClose: () => void,
  onSubmit: () => void,
}) {
  const { trans } = useTranslation();
  const { formRepresentation, setValue, validate } = useForm(formState);

  const { call, performing } = useAxios('post', LOCATIONS_PATH.replace(':id', ''));

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
            {trans('createLocation')}
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
