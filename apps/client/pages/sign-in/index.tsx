import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import {
  Container, Typography, Box,
} from '@mui/material';
import useTranslation from '../../hooks/useTranslation';
import { DASHBOARD } from '../../utils/routes';
import useSecurity from '../../hooks/useSecurity';
import SignInForm from '../../components/signIn/signInForm';
import SignUpForm from '../../components/signIn/signUpForm';
import ForgotPasswordForm from '../../components/signIn/forgoutPasswordForm';
import { FormValues } from '../../components/signIn/types';
import ChangePasswordForm from '../../components/signIn/changePasswordForm';

export default function LoginPage() {
  const { trans } = useTranslation();
  const { state: { user } } = useSecurity();
  const [selectedForm, setSelectedForm] = useState<{
    form: FormValues,
    username: string | undefined
  }>({ form: 'signIn', username: '' });
  const router = useRouter();

  const handleSelectForm = ({ form, username }: { form: FormValues, username? : string }) => {
    setSelectedForm({ form, username });
  };

  useEffect(() => {
    if (user) {
      router.push(DASHBOARD);
    }
  }, [user, router]);

  return !user && (
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
            {SignInForm.type === selectedForm.form
            && <SignInForm onFormSelected={handleSelectForm} username={selectedForm.username} />}
            {SignUpForm.type === selectedForm.form
            && <SignUpForm onFormSelected={handleSelectForm} username={selectedForm.username} />}
            {ChangePasswordForm.type === selectedForm.form
            && (
            <ChangePasswordForm
              onFormSelected={handleSelectForm}
              username={selectedForm.username}
            />
            )}
            {ForgotPasswordForm.type === selectedForm.form
            && (
            <ForgotPasswordForm
              onFormSelected={handleSelectForm}
              username={selectedForm.username}
            />
            )}
          </Box>
        </Container>
      </Box>
    </>
  );
}
