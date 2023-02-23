import { SyntheticEvent } from 'react';
import {
  Stack, TextField, Typography, Button,
} from '@mui/material';
import useTranslation from '../../hooks/useTranslation';
import useForm from '../../hooks/useForm';
import useSecurity from '../../hooks/useSecurity';
import { SetSelectedForm } from './types';

function ForgotPasswordForm(
  { onFormSelected }:
  { onFormSelected: SetSelectedForm },
) {
  const { trans } = useTranslation();
  const { formRepresentation, setValue, validate } = useForm({
    emailOrUsername: {
      value: '',
      required: true,
    },
  });
  const { forgotPassword, state: { loading } } = useSecurity();

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    if (!loading && !validate()) {
      try {
        await forgotPassword({
          emailOrUsername: formRepresentation.emailOrUsername.value.toString(),
        });
        onFormSelected({ form: 'changePassword' });
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
          onClick={() => !loading && onFormSelected({ form: 'signIn' })}
          sx={{ cursor: 'pointer' }}
        >
          {trans('signIn')}
        </Typography>
      </Stack>
      <form onSubmit={handleSubmit}>
        <Stack spacing={3} sx={{ mb: 2 }}>
          <TextField
            error={Boolean(formRepresentation.emailOrUsername.error)}
            helperText={formRepresentation.emailOrUsername.error}
            name="emailOrUsername"
            label={trans('emailOrUsername')}
            onChange={(e) => setValue({ field: 'emailOrUsername', value: e.target.value })}
            value={formRepresentation.emailOrUsername.value}
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
