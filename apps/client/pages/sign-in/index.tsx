import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import {
  Container, Typography, Box,
} from '@mui/material';
import useTranslation from '../../hooks/useTranslation';
import { DASHBOARD } from '../../utils/routes';
import useSecurity from '../../hooks/useSecurity';
import SignInForm from './signInForm';
import SignUpForm from './signUpForm';
import ConfirmationForm from './confirmationForm';

export default function LoginPage() {
  const { trans } = useTranslation();
  const { state: { user } } = useSecurity();
  const [selectedForm, setSelectedForm] = useState<'signIn' | 'signUp' | 'confirmation'>('signIn');
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push(DASHBOARD);
    }
  }, [user, router]);

  return (
    <>
      <Head>
        <title>{trans('signIn')}</title>
      </Head>
      <Box
        component="main"
        sx={{
          display: 'flex',
          flexGrow: 1,
          minHeight: '100%',
          flexDirection: { xs: 'column', sm: 'row' },
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: 480,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            boxShadow: (theme) => theme.shadows[2],
            backgroundColor: (theme) => theme.palette.background.default,
          }}
        >
          <Typography
            variant="h3"
            sx={{
              px: 5, mt: 10, mb: 5, width: { xs: '100%' }, maxWidth: { xs: 'none' },
            }}
          >
            {trans('welcomeBackGreetings')}
          </Typography>
        </Box>
        <Container maxWidth="sm">
          <Box
            sx={{
              maxWidth: 480,
              margin: 'auto',
              minHeight: '100vh',
              display: 'flex',
              justifyContent: 'center',
              flexDirection: 'column',
              padding: (theme) => theme.spacing(12, 0),
            }}
          >
            {SignInForm.type === selectedForm
            && <SignInForm onFormSelected={setSelectedForm} />}
            {SignUpForm.type === selectedForm
            && <SignUpForm onFormSelected={setSelectedForm} />}
            {ConfirmationForm.type === selectedForm
            && <ConfirmationForm onFormSelected={setSelectedForm} />}
          </Box>
        </Container>
      </Box>
    </>
  );
}
