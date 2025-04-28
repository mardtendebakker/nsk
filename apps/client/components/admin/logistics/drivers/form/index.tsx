import { Box } from '@mui/material';
import { SetValue, FormRepresentation } from '../../../../../hooks/useForm';
import useTranslation from '../../../../../hooks/useTranslation';
import BorderedBox from '../../../../borderedBox';
import TextField from '../../../../memoizedInput/textField';

export default function Form({
  setValue,
  formRepresentation,
  disabled = false,
}: {
  setValue: SetValue,
  formRepresentation: FormRepresentation
  disabled?: boolean
}) {
  const { trans } = useTranslation();

  return (
    <BorderedBox sx={{ width: '20rem', p: '1rem' }}>
      <TextField
        sx={{ mb: '1rem' }}
        fullWidth
        label={trans('driverForm.firstName.label')}
        placeholder={trans('driverForm.firstName.placeholder')}
        value={formRepresentation.first_name.value || ''}
        helperText={formRepresentation.first_name.error}
        error={!!formRepresentation.first_name.error}
        onChange={(e) => setValue({ field: 'first_name', value: e.target.value })}
        disabled={disabled}
      />
      <Box sx={{ mb: '1rem' }} />
      <TextField
        sx={{ mb: '1rem' }}
        fullWidth
        label={trans('driverForm.lastName.label')}
        placeholder={trans('driverForm.lastName.placeholder')}
        value={formRepresentation.last_name.value || ''}
        helperText={formRepresentation.last_name.error}
        error={!!formRepresentation.last_name.error}
        onChange={(e) => setValue({ field: 'last_name', value: e.target.value })}
        disabled={disabled}
      />
      <Box sx={{ mb: '1rem' }} />
      <TextField
        sx={{ mb: '1rem' }}
        fullWidth
        label={trans('driverForm.email.label')}
        placeholder={trans('driverForm.email.placeholder')}
        value={formRepresentation.email.value || ''}
        helperText={formRepresentation.email.error}
        error={!!formRepresentation.email.error}
        onChange={(e) => setValue({ field: 'email', value: e.target.value })}
        disabled={disabled || !!formRepresentation.id.value}
      />
      <Box sx={{ mb: '1rem' }} />
      <TextField
        sx={{ mb: '1rem' }}
        fullWidth
        label={trans('driverForm.username.label')}
        placeholder={trans('driverForm.username.placeholder')}
        value={formRepresentation.username.value || ''}
        helperText={formRepresentation.username.error}
        error={!!formRepresentation.username.error}
        onChange={(e) => setValue({ field: 'username', value: e.target.value })}
        disabled={disabled || !!formRepresentation.id.value}
      />
    </BorderedBox>
  );
}
