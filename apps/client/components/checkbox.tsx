import { Box, Checkbox as BaseCheckbox, Typography } from '@mui/material';

export default function Checkbox({
  disabled, checked, onCheck, label,
}: {
  checked: boolean,
  onCheck: (check:boolean) => void,
  label: string,
  disabled?: boolean,
}) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <BaseCheckbox
        disabled={disabled}
        checked={checked}
        onChange={(_, value) => onCheck(value)}
      />
      <Typography>{label}</Typography>
    </Box>
  );
}

Checkbox.defaultProps = { disabled: false };
