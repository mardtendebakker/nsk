import {
  Box, Button, Dialog, DialogActions,
  DialogContent, DialogTitle,
  IconButton,
} from '@mui/material';
import Close from '@mui/icons-material/Close';
import { useMemo } from 'react';
import { User } from '../../../../utils/axios/models/user';
import useTranslation from '../../../../hooks/useTranslation';
import useForm from '../../../../hooks/useForm';
import UserForm from '../userForm';

function makeFormRepresentation(user: User) {
  return {};
}

export default function Create({ open, onClose }: { open: boolean, onClose: () => void }) {
  const { trans } = useTranslation();
  const {
    formRepresentation,
    setValue,
  } = useForm(useMemo(makeFormRepresentation.bind(null, {}), []));

  return (
    <Dialog open={open} onClose={onClose} maxWidth={false}>
      <form>
        <DialogTitle>
          <Box sx={{ justifyContent: 'space-between', alignItems: 'center', display: 'flex' }}>
            {trans('createUser')}
            <IconButton>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <UserForm setValue={setValue} formRepresentation={formRepresentation} />
        </DialogContent>
        <DialogActions>
          <Button size="small" onClick={onClose} variant="outlined" color="inherit">{trans('cancel')}</Button>
          <Button size="small" type="submit" onClick={onClose} variant="contained" color="primary">{trans('save')}</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
