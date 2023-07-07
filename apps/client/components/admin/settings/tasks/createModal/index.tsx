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
import { TASKS_PATH } from '../../../../../utils/axios';
import { Task } from '../../../../../utils/axios/models/product';

export function initFormState(task?: Task) {
  return {
    name: { value: task?.name, required: true },
    description: { value: task?.description },
    productTypes: { value: task?.productTypes?.map(({ id }) => id) || [] },
  };
}

export function formRepresentationToBody(formRepresentation: FormRepresentation) {
  const body = {};

  Object.keys(formRepresentation).forEach((key) => {
    const value = formRepresentation[key].value || null;

    body[key] = value;
  });

  return body;
}

const formState = initFormState();

export default function CreateModal({ onClose, onSubmit }: {
  onClose: () => void,
  onSubmit: () => void,
}) {
  const { trans } = useTranslation();
  const { formRepresentation, setValue, validate } = useForm(formState);

  const { call, performing } = useAxios('post', TASKS_PATH.replace(':id', ''));

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
            {trans('createTask')}
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
