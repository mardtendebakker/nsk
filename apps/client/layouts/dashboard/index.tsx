import { useEffect, useState } from 'react';
import { Box, Container } from '@mui/material';
import { useRouter } from 'next/router';
import useSecurity from '../../hooks/useSecurity';
import Header from './header';
import {
  ACCOUNT_VERIFICATION, getRouteGroups, getDefaultPath, HOME,
} from '../../utils/routes';
import { Group } from '../../stores/security/types';
import can from '../../utils/can';

export default function DashboardLayout({ children }: { children: JSX.Element | JSX.Element[] }) {
  const { state: { user }, refreshUserInfo } = useSecurity();
  const [canShowPage, setCanShowPage] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push(HOME);
    } else if (!user.emailVerified) {
      router.push(ACCOUNT_VERIFICATION);
    } else {
      const requiredGroups: undefined | Group[] = getRouteGroups(router.pathname);

      if (requiredGroups && !can(user.groups, requiredGroups)) {
        router.push(getDefaultPath(user));
      } else {
        setCanShowPage(true);
      }
    }
  }, [user, router]);

  useEffect(() => {
    if (user?.emailVerified) {
      refreshUserInfo().catch(() => {});
    }
  }, []);

  return user?.emailVerified && canShowPage && (
    <>
      <Header />
      <Box
        sx={(theme) => ({ minHeight: '100%', p: '1rem', background: theme.palette.grey[10] })}
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
