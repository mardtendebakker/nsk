import { SyntheticEvent, useState } from 'react';
import {
  Stack, IconButton, InputAdornment, TextField, Typography,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import RemoveRedEye from '@mui/icons-material/RemoveRedEye';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import useTranslation from '../../hooks/useTranslation';
import useForm from '../../hooks/useForm';
import useSecurity from '../../hooks/useSecurity';

const initFormState = {
  username: {
    value: '',
    required: true,
  },
  password: {
    value: '',
    required: true,
  },
};

function SignInForm(
  { onFormSelected }:
  { onFormSelected: (formType :'signIn' | 'signUp' | 'confirmation') => void },
) {
  const [showPassword, setShowPassword] = useState(false);
  const { formRepresentation, setValue, validate } = useForm(initFormState);
  const { trans } = useTranslation();
  const { signIn } = useSecurity();

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    if (!validate()) {
      try {
        await signIn({
          username: formRepresentation.username.value.toString(),
          password: formRepresentation.password.value.toString(),
        });
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
        {trans('signIn')}
      </Typography>
      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
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
          alignItems="center"
          justifyContent="space-between"
          sx={{ my: 2 }}
        />
        <Stack direction="row" alignItems="center" justifyContent="space-evenly" sx={{ my: 2 }}>
          <Typography variant="button" color="primary" onClick={() => onFormSelected('signUp')} sx={{ cursor: 'pointer' }}>
            {trans('signUp')}
          </Typography>
          <Typography variant="button" color="primary" onClick={() => onFormSelected('confirmation')} sx={{ cursor: 'pointer' }}>
            {trans('confirmAccount')}
          </Typography>
        </Stack>
        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          onClick={handleSubmit}
        >
          {trans('signIn')}
        </LoadingButton>
      </form>
    </>
  );
}

SignInForm.type = 'signIn';

export default SignInForm;
