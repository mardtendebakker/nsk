import {
  Button, Typography, Stack, IconButton, InputAdornment, TextField,
} from '@mui/material';
import { SyntheticEvent, useState } from 'react';
import RemoveRedEye from '@mui/icons-material/RemoveRedEye';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { isPassword } from '../../utils/validator';
import useAxios from '../../hooks/useAxios';
import { CHANGE_PASSWORD_PATH } from '../../utils/axios';
import useForm, { FormRepresentation } from '../../hooks/useForm';
import useTranslation from '../../hooks/useTranslation';

function PasswordForm() {
  const { trans } = useTranslation();
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showPasswordPasswordConfirmation, setShowPasswordPasswordConfirmation] = useState(false);
  const { formRepresentation, setValue, validate } = useForm({
    oldPassword: {
      value: '',
      required: true,
      validator: (data: FormRepresentation) => (!isPassword(data.oldPassword.value.toString()) ? trans('passwordRegexError') : undefined),
    },
    newPassword: {
      value: '',
      required: true,
      validator: (data: FormRepresentation) => (!isPassword(data.newPassword.value.toString()) ? trans('passwordRegexError') : undefined),

    },
    passwordConfirmation: {
      value: '',
      required: true,
      validator: (data: FormRepresentation) => {
        if (
          data.newPassword.value.toString()
        !== data.passwordConfirmation.value.toLocaleString()
        ) {
          return trans('notSamePasswordError');
        }

        return undefined;
      },
    },
  });
  const { call, performing } = useAxios(
    'post',
    CHANGE_PASSWORD_PATH,
    { withProgressBar: true, showSuccessMessage: true },
  );

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    if (validate() || performing) {
      return;
    }

    call({
      body: {
        oldPassword: formRepresentation.oldPassword.value,
        newPassword: formRepresentation.newPassword.value,
      },
    });
  };

  return (
    <>
      <Typography
        variant="h4"
        gutterBottom
      >
        {trans('changePassword')}
      </Typography>
      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            error={!!formRepresentation?.oldPassword.error}
            helperText={formRepresentation?.oldPassword.error}
            label={trans('oldPassword')}
            onChange={(e) => setValue({ field: 'oldPassword', value: e.target.value })}
            value={formRepresentation?.oldPassword.value}
            type={showOldPassword ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={
                      () => setShowOldPassword(!showOldPassword)
                    }
                    edge="end"
                  >
                    {showOldPassword ? <RemoveRedEye /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            error={!!formRepresentation?.newPassword.error}
            helperText={formRepresentation?.newPassword.error}
            label={trans('newPassword')}
            onChange={(e) => setValue({ field: 'newPassword', value: e.target.value })}
            value={formRepresentation?.newPassword.value}
            type={showNewPassword ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={
                      () => setShowNewPassword(!showNewPassword)
                    }
                    edge="end"
                  >
                    {showNewPassword ? <RemoveRedEye /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            error={!!formRepresentation?.passwordConfirmation.error}
            helperText={formRepresentation?.passwordConfirmation.error}
            label={trans('passwordConfirmation')}
            onChange={(e) => setValue({ field: 'passwordConfirmation', value: e.target.value })}
            value={formRepresentation?.passwordConfirmation.value}
            type={showPasswordPasswordConfirmation ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={
                      () => setShowPasswordPasswordConfirmation(!showPasswordPasswordConfirmation)
                    }
                    edge="end"
                  >
                    {showPasswordPasswordConfirmation ? <RemoveRedEye /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Stack>
        <Button
          sx={{ my: 2 }}
          disabled={performing}
          fullWidth
          size="large"
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

export default PasswordForm;
