import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import { Button } from '@mui/material';
import useTranslation from '../hooks/useTranslation';

type Color = 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
type Variant = 'text' | 'outlined' | 'contained';

export default function ConfirmationDialog(
  {
    onConfirm,
    onClose,
    title,
    content,
    confirmButtonColor,
    cancelButtonColor,
    cancelButtonText,
    confirmButtonText,
    confirmButtonVariant,
    cancelButtonVariant,
    disabled,
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
  },
) {
  const { trans } = useTranslation();

  return (
    <Dialog
      open
      onClose={onClose}
      fullWidth
    >
      <DialogTitle>
        {title}
      </DialogTitle>
      <DialogContent>
        {content}
      </DialogContent>
      <DialogActions sx={{ mt: '1rem', p: '24px' }}>
        <Button onClick={onClose} variant={cancelButtonVariant} color={cancelButtonColor}>
          {cancelButtonText || trans('cancel')}
        </Button>
        <Button
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

ConfirmationDialog.defaultProps = {
  confirmButtonColor: 'primary',
  cancelButtonColor: 'inherit',
  cancelButtonText: undefined,
  confirmButtonText: undefined,
  cancelButtonVariant: 'outlined',
  confirmButtonVariant: 'contained',
  disabled: false,
};
