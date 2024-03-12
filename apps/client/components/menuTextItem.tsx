import { Typography } from '@mui/material';

export default function MenuItemText({ children, active, color }: { children: string | JSX.Element, active?: boolean, color?: string }) {
  return (
    <Typography
      sx={(theme) => ({ fontWeight: active ? theme.typography.fontWeightBold : undefined })}
      color={color}
      variant="body1"
    >
      {children}
    </Typography>
  );
}

MenuItemText.defaultProps = { active: false, color: 'primary' };
