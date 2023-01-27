import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { styled } from '@mui/material/styles';
import {
  Container, Typography, Box, Stack, IconButton, InputAdornment, TextField,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import RemoveRedEye from '@mui/icons-material/RemoveRedEye';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { trans } from 'itranslator';
import useForm from '../hooks/useForm';

const initFormState = {
  email: {
    value: '',
    required: true,
  },
  password: {
    value: '',
    required: true,
  },
};

const StyledSection = styled('div')(({ theme }) => ({
  width: '100%',
  maxWidth: 480,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  boxShadow: theme.shadows[2],
  backgroundColor: theme.palette.background.default,
}));

const StyledContent = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { formData, setValue, validate } = useForm(initFormState);
  const router = useRouter();

  const handleClick = () => {
    if (!validate()) {
      router.push('/');
    }
  };

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
        <StyledSection>
          <Typography
            variant="h3"
            sx={{
              px: 5, mt: 10, mb: 5, width: { xs: '100%' }, maxWidth: { xs: 'none' },
            }}
          >
            {trans('welcomeBackGreetings')}
          </Typography>
        </StyledSection>
        <Container maxWidth="sm">
          <StyledContent>
            <Typography
              variant="h4"
              gutterBottom
            >
              {trans('signIn')}
            </Typography>

            <Stack spacing={3}>
              <TextField
                error={Boolean(formData.email.error)}
                helperText={formData.email.error}
                name="email"
                label={trans('emailAddress')}
                onChange={(e) => setValue({ field: 'email', value: e.target.value })}
                type="email"
                value={formData.email.value}
              />
              <TextField
                error={Boolean(formData.password.error)}
                helperText={formData.password.error}
                name="password"
                label={trans('password')}
                onChange={(e) => setValue({ field: 'password', value: e.target.value })}
                value={formData.password.value}
                type={showPassword ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <RemoveRedEye /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Stack>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{ my: 2 }}
            />
            <LoadingButton
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              onClick={handleClick}
            >
              {trans('login')}
            </LoadingButton>
          </StyledContent>
        </Container>
      </Box>
    </>
  );
}
