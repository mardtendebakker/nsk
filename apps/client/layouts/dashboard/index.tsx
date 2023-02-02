import { useState } from 'react';
import { Box } from '@mui/material';
import Header from './header';
import Nav from './nav';

export default function DashboardLayout({ children }: { children: JSX.Element | JSX.Element[] }) {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <Header onOpenNav={() => setOpen(true)} />
      <Nav openNav={open} onCloseNav={() => setOpen(false)} />
      <Box sx={{ py: 10, pl: { xs: 2, lg: 37 }, pr: 2 }}>
        {children}
      </Box>
    </>
  );
}
