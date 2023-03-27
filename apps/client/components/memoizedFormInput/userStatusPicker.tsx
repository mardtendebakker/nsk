import { TextFieldProps } from '@mui/material';
import { memo } from 'react';
import useTranslation from '../../hooks/useTranslation';
import Select from '../select';

function UserStatusPicker({ label, sx } : TextFieldProps) {
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

export default memo(
  UserStatusPicker,
  (prevProps, nextProps) => JSON.stringify(prevProps) === JSON.stringify(nextProps),
);
