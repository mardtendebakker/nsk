import { TextFieldProps } from '@mui/material';
import useTranslation from '../../hooks/useTranslation';
import Select from './select';

export default function UserRolePicker({ label, sx, fullWidth } : TextFieldProps) {
  const { trans } = useTranslation();

  return (
    <Select
      options={[]}
      sx={sx}
      fullWidth={fullWidth}
      label={label || trans('role')}
      placeholder={trans('selectRole')}
    />
  );
}
