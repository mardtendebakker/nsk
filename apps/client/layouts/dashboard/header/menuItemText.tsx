import { Typography } from '@mui/material';

export default function MenuItemText({ children, active }: { children: string, active: boolean }) {
  return (
    <Typography
      sx={(theme) => ({ fontWeight: active ? theme.typography.fontWeightBold : undefined })}
      color="primary"
      variant="body1"
    >
      {children}
    </Typography>
  );
}
