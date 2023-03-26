import { TextFieldProps } from '@mui/material';
import { memo } from 'react';
import useTranslation from '../../hooks/useTranslation';
import Select from '../select';

function UserRolePicker({ label, sx, fullWidth } : TextFieldProps) {
  const { trans } = useTranslation();

  return (
    <Select
      options={[]}
      sx={sx}
      fullWidth={fullWidth}
      name="role"
      label={label || trans('role')}
      placeholder={trans('selectRole')}
    />
  );
}

export default memo(
  UserRolePicker,
  (prevProps, nextProps) => JSON.stringify(prevProps) === JSON.stringify(nextProps),
);
