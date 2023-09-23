import { Typography } from '@mui/material';
import Link from 'next/link';

export default function HeaderItem({ text, href, active }: { text: string, href: string, active: boolean }) {
  return (
    <Link href={href} style={{ textDecoration: 'none', color: 'unset' }}>
      <Typography
        key={text}
        variant="h5"
        sx={(theme) => ({
          cursor: 'pointer',
          background: active ? theme.palette.primary.light : undefined,
          color: active ? theme.palette.primary.main : undefined,
          p: '.5rem .75rem',
          mr: '.5rem',
          mb: '.5rem',
        })}
      >
        {text}
      </Typography>
    </Link>
  );
}
