import { SyntheticEvent } from 'react';
import {
  Stack, TextField, Typography, Button,
} from '@mui/material';
import useTranslation from '../../hooks/useTranslation';
import useForm from '../../hooks/useForm';
import useSecurity from '../../hooks/useSecurity';
import { SetSelectedForm } from './types';

function ForgotPasswordForm(
  { onFormSelected, username }:
  {
    onFormSelected: SetSelectedForm,
    username :string | undefined
  },
) {
  const { trans } = useTranslation();
  const { formRepresentation, setValue, validate } = useForm({
    username: {
      value: username || '',
      required: true,
    },
  });
  const { forgotPassword, state: { loading } } = useSecurity();

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    if (!loading && !validate()) {
      try {
        await forgotPassword({ username: formRepresentation.username.value.toString() });
        onFormSelected({ form: 'changePassword', username });
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
        {trans('forgotPasswordMessage')}
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
          onClick={() => !loading && onFormSelected({ form: 'signIn', username: formRepresentation.username.value.toString() })}
          sx={{ cursor: 'pointer' }}
        >
          {trans('signIn')}
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
        </Stack>
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
    </>
  );
}

ForgotPasswordForm.type = 'forgotPassword';

export default ForgotPasswordForm;
