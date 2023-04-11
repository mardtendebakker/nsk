import { useEffect, SyntheticEvent } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import {
  Box, InputAdornment, Stack, TextField, Typography, Button,
} from '@mui/material';
import useTranslation from '../hooks/useTranslation';
import useSecurity from '../hooks/useSecurity';
import useForm from '../hooks/useForm';
import { DASHBOARD, SIGN_IN } from '../utils/routes';

export default function AccountVerification() {
  const { trans } = useTranslation();
  const {
    confirmAccount, sendVerificationCode, state: { user, loading }, signOut,
  } = useSecurity();
  const router = useRouter();

  const { formRepresentation, setValue, validate } = useForm({
    code: {
      value: '',
      required: true,
    },
  });

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    if (!loading && !validate()) {
      try {
        await confirmAccount({ code: formRepresentation.code.value.toString() });
      // eslint-disable-next-line no-empty
      } catch { }
    }
  };

  useEffect(() => {
    if (!user) {
      router.push(SIGN_IN);
    } else if (user.emailVerified) {
      router.push(DASHBOARD);
    }
  }, [user, router]);

  return user && !user.emailVerified && (
    <>
      <Head>
        <title>{trans('accountVerification')}</title>
      </Head>
      <Box
        component="main"
        sx={{
          display: 'flex',
          flexGrow: 1,
          height: '100%',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Button color="error" onClick={signOut} sx={{ position: 'absolute', right: 10, top: 10 }}>
          {trans('logout')}
        </Button>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ mb: 10 }}
        >
          {trans('accountVerificationMessage')}
        </Typography>
        <form onSubmit={handleSubmit}>
          <Stack spacing={1}>
            <TextField
              error={Boolean(formRepresentation.code.error)}
              helperText={formRepresentation.code.error}
              name="code"
              label={trans('code')}
              onChange={(e) => setValue({ field: 'code', value: e.target.value })}
              value={formRepresentation.code.value}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Button
                      disabled={loading}
                      onClick={sendVerificationCode}
                    >
                      {trans('sendCode')}
                    </Button>
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
          <Button
            disabled={loading}
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            onClick={handleSubmit}
          >
            {trans('confirm')}
          </Button>
        </form>
      </Box>
    </>
  );
}
