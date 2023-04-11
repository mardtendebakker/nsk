import { TextFieldProps } from '@mui/material';
import useTranslation from '../../hooks/useTranslation';
import Select from './select';

export default function UserStatusPicker({ label, sx } : TextFieldProps) {
  const { trans } = useTranslation();

  return (
    <Select
      options={[]}
      sx={sx}
      name="status"
      label={label || trans('status')}
      placeholder={trans('selectStatus')}
    />
  );
}
