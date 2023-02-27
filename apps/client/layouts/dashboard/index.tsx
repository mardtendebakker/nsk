import { useEffect } from 'react';
import { Box } from '@mui/material';
import { useRouter } from 'next/router';
import useSecurity from '../../hooks/useSecurity';
import Header from './header';
import { SIGN_IN, ACCOUNT_VERIFICATION } from '../../utils/routes';

export default function DashboardLayout({ children }: { children: JSX.Element | JSX.Element[] }) {
  const { state: { user }, refreshUserInfo } = useSecurity();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push(SIGN_IN);
    } else if (!user.emailVerified) {
      router.push(ACCOUNT_VERIFICATION);
    }
  }, [user, router]);

  useEffect(() => {
    if (user?.emailVerified) {
      refreshUserInfo();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return user?.emailVerified && (
    <>
      <Header />
      <Box sx={(theme) => ({
        minHeight: '100%', pt: 15, pb: 3, px: 3, background: theme.palette.grey[10],
      })}
      >
        {children}
      </Box>
    </>
  );
}
