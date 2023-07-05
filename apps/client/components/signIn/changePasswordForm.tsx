import { SyntheticEvent, useState } from 'react';
import {
  Stack, Typography, Button, IconButton, InputAdornment,
} from '@mui/material';
import RemoveRedEye from '@mui/icons-material/RemoveRedEye';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { isPassword } from '../../utils/validator';
import useTranslation from '../../hooks/useTranslation';
import useForm, { FormRepresentation } from '../../hooks/useForm';
import useSecurity from '../../hooks/useSecurity';
import { SetSelectedForm } from './types';
import TextField from '../input/textField';

function ChangePasswordForm(
  { onFormSelect }:
  { onFormSelect: SetSelectedForm },
) {
  const [showPassword, setShowPassword] = useState(false);
  const { trans } = useTranslation();
  const { formRepresentation, setValue, validate } = useForm({
    emailOrUsername: {
      value: '',
      required: true,
    },
    verificationCode: {
      value: '',
      required: true,
    },
    newPassword: {
      value: '',
      required: true,
      validator: (data: FormRepresentation) => (!isPassword(data.newPassword.value.toString()) ? trans('passwordRegexError') : undefined),
    },
  });
  const { changePassword, state: { loading } } = useSecurity();

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    if (!loading && !validate()) {
      try {
        await changePassword({
          emailOrUsername: formRepresentation.emailOrUsername.value.toString(),
          verificationCode: formRepresentation.verificationCode.value.toString(),
          newPassword: formRepresentation.newPassword.value.toString(),
        });
        onFormSelect({ form: 'signIn' });
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
        {trans('changePassword')}
      </Typography>
      <Stack
        direction="row"
        alignItems="end"
        justifyContent="end"
        sx={{ mb: 2 }}
      >
        <Typography
          variant="h5"
          color="primary"
          onClick={() => !loading && onFormSelect({ form: 'signIn' })}
          sx={{ cursor: 'pointer' }}
        >
          {trans('signIn')}
        </Typography>
      </Stack>
      <form onSubmit={handleSubmit} name="changePassword">
        <Stack spacing={1} sx={{ mb: 2 }}>
          <TextField
            error={Boolean(formRepresentation.emailOrUsername.error)}
            helperText={formRepresentation.emailOrUsername.error}
            name="emailOrUsername"
            label={trans('emailOrUsername')}
            onChange={(e) => setValue({ field: 'emailOrUsername', value: e.target.value })}
            value={formRepresentation.emailOrUsername.value}
          />
          <TextField
            error={Boolean(formRepresentation.verificationCode.error)}
            helperText={formRepresentation.verificationCode.error}
            name="verificationCode"
            label={trans('verificationCode')}
            onChange={(e) => setValue({ field: 'verificationCode', value: e.target.value })}
            value={formRepresentation.verificationCode.value}
          />
          <TextField
            error={Boolean(formRepresentation.newPassword.error)}
            helperText={formRepresentation.newPassword.error}
            name="newPassword"
            label={trans('newPassword')}
            onChange={(e) => setValue({ field: 'newPassword', value: e.target.value })}
            value={formRepresentation.newPassword.value}
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
          size="small"
          disabled={loading}
          fullWidth
          type="submit"
          variant="contained"
          onClick={handleSubmit}
        >
          {trans('confirm')}
        </Button>
      </form>
    </>
  );
}

ChangePasswordForm.type = 'changePassword';

export default ChangePasswordForm;
