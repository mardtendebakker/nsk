import { useEffect } from 'react';
import { Box, Container } from '@mui/material';
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
  }, []);

  return user?.emailVerified && (
    <>
      <Header />
      <Box
        sx={(theme) => ({
          minHeight: '100%', pt: 5, pb: 3, px: 3, background: theme.palette.grey[10],
        })}
      >
        <Box
          component="main"
          sx={{ py: 8 }}
        >
          <Container maxWidth={false}>
            {children}
          </Container>
        </Box>
      </Box>
    </>
  );
}
