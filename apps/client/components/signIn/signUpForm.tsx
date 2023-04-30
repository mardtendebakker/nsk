import { SyntheticEvent, useState } from 'react';
import {
  Stack, IconButton, InputAdornment, Typography, Button,
} from '@mui/material';
import RemoveRedEye from '@mui/icons-material/RemoveRedEye';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { isPassword } from '../../utils/validator';
import useTranslation from '../../hooks/useTranslation';
import useForm, { FormRepresentation } from '../../hooks/useForm';
import useSecurity from '../../hooks/useSecurity';
import { SetSelectedForm } from './types';
import TextField from '../input/textField';

function SignUpForm(
  { onFormSelected }:
  { onFormSelected: SetSelectedForm },
) {
  const [showPassword, setShowPassword] = useState(false);
  const { trans } = useTranslation();
  const { formRepresentation, setValue, validate } = useForm({
    username: {
      value: '',
      required: true,
    },
    email: {
      value: '',
      required: true,
    },
    password: {
      value: '',
      required: true,
      validator: (data: FormRepresentation) => (!isPassword(data.password.value.toString()) ? trans('passwordRegexError') : undefined),
    },
  });
  const { signUp, state: { loading } } = useSecurity();

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    if (!loading && !validate()) {
      const newUsername = formRepresentation.username.value.toString();

      try {
        await signUp({
          username: newUsername,
          email: formRepresentation.email.value.toString(),
          password: formRepresentation.password.value.toString(),
        });
        onFormSelected({ form: 'signIn' });
      // eslint-disable-next-line no-empty
      } catch {}
    }
  };

  return (
    <>

      <Typography
        variant="h4"
        gutterBottom
      >
        {trans('signUp')}
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
          onClick={() => !loading && onFormSelected({ form: 'signIn' })}
          sx={{ cursor: 'pointer' }}
        >
          {trans('signIn')}
        </Typography>
      </Stack>
      <form onSubmit={handleSubmit} name="signUp">
        <Stack spacing={1} sx={{ mb: 2 }}>
          <TextField
            error={Boolean(formRepresentation.username.error)}
            helperText={formRepresentation.username.error}
            name="username"
            label={trans('username')}
            onChange={(e) => setValue({ field: 'username', value: e.target.value })}
            value={formRepresentation.username.value}
          />
          <TextField
            error={Boolean(formRepresentation.email.error)}
            helperText={formRepresentation.email.error}
            name="email"
            type="email"
            label={trans('email')}
            onChange={(e) => setValue({ field: 'email', value: e.target.value })}
            value={formRepresentation.email.value}
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
        <Button
          disabled={loading}
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          onClick={handleSubmit}
        >
          {trans('signUp')}
        </Button>
      </form>
    </>
  );
}

SignUpForm.type = 'signUp';

export default SignUpForm;
