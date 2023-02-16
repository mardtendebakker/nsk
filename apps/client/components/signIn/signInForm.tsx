import { SyntheticEvent, useState } from 'react';
import {
  Stack, IconButton, InputAdornment, TextField, Typography, Button,
} from '@mui/material';
import RemoveRedEye from '@mui/icons-material/RemoveRedEye';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { isPassword } from '../../utils/validator';
import useTranslation from '../../hooks/useTranslation';
import useForm, { FormRepresentation } from '../../hooks/useForm';
import useSecurity from '../../hooks/useSecurity';
import { SetSelectedForm } from './types';

function SignInForm(
  { onFormSelected, username }:
  {
    onFormSelected: SetSelectedForm,
    username :string | undefined
  },
) {
  const [showPassword, setShowPassword] = useState(false);
  const { trans } = useTranslation();
  const { formRepresentation, setValue, validate } = useForm({
    username: {
      value: username || '',
      required: true,
    },
    password: {
      value: '',
      required: true,
      validator: (data: FormRepresentation) => (!isPassword(data.password.value.toString()) ? trans('passwordRegexError') : undefined),
    },
  });
  const { signIn, state: { loading } } = useSecurity();

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    if (!loading && !validate()) {
      try {
        await signIn({
          username: formRepresentation.username.value.toString(),
          password: formRepresentation.password.value.toString(),
        });
      // eslint-disable-next-line no-empty
      } catch { }
    }
  };

  return (
    <>

      <Typography
        variant="h4"
        gutterBottom
      >
        {trans('signIn')}
      </Typography>
      <Stack
        direction="row"
        alignItems="end"
        justifyContent="end"
        sx={{ mb: 2 }}
      >
        <Typography
          variant="button"
          color="primary"
          onClick={() => !loading && onFormSelected({ form: 'signUp', username: formRepresentation.username.value.toString() })}
          sx={{ cursor: 'pointer' }}
        >
          {trans('signUp')}
        </Typography>
      </Stack>
      <form onSubmit={handleSubmit}>
        <Stack spacing={3} sx={{ mb: 2 }}>
          <TextField
            error={Boolean(formRepresentation.username.error)}
            helperText={formRepresentation.username.error}
            name="username"
            label={trans('username')}
            onChange={(e) => setValue({ field: 'username', value: e.target.value })}
            value={formRepresentation.username.value}
          />
          <TextField
            error={Boolean(formRepresentation.password.error)}
            helperText={formRepresentation.password.error}
            name="password"
            label={trans('password')}
            onChange={(e) => setValue({ field: 'password', value: e.target.value })}
            value={formRepresentation.password.value}
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
          alignItems="end"
          justifyContent="end"
          sx={{ mb: 2 }}
        >
          <Typography
            variant="button"
            color="primary"
            onClick={() => !loading && onFormSelected({ form: 'forgotPassword', username: formRepresentation.username.value.toString() })}
            sx={{ cursor: 'pointer' }}
          >
            {trans('forgotPasswordQuestion')}
          </Typography>
        </Stack>
        <Button
          disabled={loading}
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          onClick={handleSubmit}
        >
          {trans('signIn')}
        </Button>
      </form>
    </>
  );
}

SignInForm.type = 'signIn';

export default SignInForm;
