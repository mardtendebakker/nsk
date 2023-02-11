import { SyntheticEvent } from 'react';
import {
  Stack, TextField, Typography,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import useTranslation from '../../hooks/useTranslation';
import useForm from '../../hooks/useForm';
import useSecurity from '../../hooks/useSecurity';

const initFormState = {
  username: {
    value: '',
    required: true,
  },
  code: {
    value: '',
    required: true,
  },
};

function ConfirmationForm(
  { onFormSelected }:
  { onFormSelected: (formType :'signIn' | 'signUp' | 'confirmation') => void },
) {
  const { formRepresentation, setValue, validate } = useForm(initFormState);
  const { trans } = useTranslation();
  const { confirmAccount } = useSecurity();

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    if (!validate()) {
      try {
        await confirmAccount({
          username: formRepresentation.username.value.toString(),
          code: formRepresentation.code.value.toString(),
        });
        onFormSelected('signIn');
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
        {trans('accountConfirmation')}
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
            error={Boolean(formRepresentation.code.error)}
            helperText={formRepresentation.code.error}
            name="code"
            label={trans('code')}
            onChange={(e) => setValue({ field: 'code', value: e.target.value })}
            value={formRepresentation.code.value}
          />
        </Stack>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ my: 2 }}
        />
        <Stack direction="row" alignItems="center" justifyContent="space-evenly" sx={{ my: 2 }}>
          <Typography variant="button" color="primary" onClick={() => onFormSelected('signIn')} sx={{ cursor: 'pointer' }}>
            {trans('signIn')}
          </Typography>
          <Typography variant="button" color="primary" onClick={() => onFormSelected('signUp')} sx={{ cursor: 'pointer' }}>
            {trans('signUp')}
          </Typography>
        </Stack>
        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          onClick={handleSubmit}
        >
          {trans('confirm')}
        </LoadingButton>
      </form>
    </>
  );
}

ConfirmationForm.type = 'confirmation';

export default ConfirmationForm;
