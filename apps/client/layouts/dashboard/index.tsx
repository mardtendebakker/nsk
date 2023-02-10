import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { useRouter } from 'next/router';
import useSecurity from '../../hooks/useSecurity';
import Header from './header';
import Nav from './nav';
import { SIGN_IN } from '../../utils/routes';

export default function DashboardLayout({ children }: { children: JSX.Element | JSX.Element[] }) {
  const [open, setOpen] = useState<boolean>(false);
  const { state: { user }, refreshUserInfo } = useSecurity();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push(SIGN_IN);
    }
  }, [user, router]);

  useEffect(() => {
    if (user) {
      refreshUserInfo();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
