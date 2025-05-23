import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import { Box, Button, IconButton } from '@mui/material';
import Close from '@mui/icons-material/Close';
import { useEffect } from 'react';
import useTranslation from '../hooks/useTranslation';

type Color = 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
type Variant = 'text' | 'outlined' | 'contained';

export default function ConfirmationDialog(
  {
    onConfirm,
    onClose,
    title,
    content,
    confirmButtonColor = 'primary',
    cancelButtonColor = 'inherit',
    cancelButtonText,
    confirmButtonText,
    cancelButtonVariant = 'outlined',
    confirmButtonVariant = 'contained',
    disabled = false,
    open = true,
  }:
  {
    onConfirm: ()=>void,
    onClose: ()=> void,
    title: JSX.Element,
    content: JSX.Element,
    confirmButtonColor?: Color,
    cancelButtonColor?: Color,
    cancelButtonText?: string,
    confirmButtonText?: string,
    confirmButtonVariant?: Variant,
    cancelButtonVariant?: Variant
    disabled?: boolean,
    open?: boolean,
  },
) {
  const { trans } = useTranslation();

  const handleEnter = (e) => {
    if (e.code == 'Enter') {
      onConfirm();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleEnter);

    return () => document.removeEventListener('keydown', handleEnter);
  }, []);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'start' }}>
          {title}
          <IconButton onClick={onClose} sx={{ ml: 'auto' }}>
            <Close sx={{ fontSize: '1rem' }} />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        {content}
      </DialogContent>
      <DialogActions sx={{ px: '24px', pb: '24px' }}>
        <Button size="small" onClick={onClose} variant={cancelButtonVariant} color={cancelButtonColor} disabled={disabled}>
          {cancelButtonText || trans('cancel')}
        </Button>
        <Button
          size="small"
          onClick={onConfirm}
          variant={confirmButtonVariant}
          color={confirmButtonColor}
          disabled={disabled}
        >
          {confirmButtonText || trans('confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
