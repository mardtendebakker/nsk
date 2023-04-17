import {
  Box, Button, Dialog, DialogActions,
  DialogContent, DialogTitle,
  IconButton,
} from '@mui/material';
import Close from '@mui/icons-material/Close';
import { useMemo } from 'react';
import { User } from '../../../../utils/axios';
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
        <Button onClick={onClose} variant="outlined" color="inherit">{trans('cancel')}</Button>
        <Button onClick={onClose} variant="contained" color="primary">{trans('saveChanges')}</Button>
      </DialogActions>
    </Dialog>
  );
}