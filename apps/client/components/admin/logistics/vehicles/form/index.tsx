import { Box } from '@mui/material';
import ChipsInput from '../../../../memoizedInput/chipsInput';
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
    <BorderedBox sx={{ maxWidth: '40rem', p: '1rem' }}>
      <TextField
        sx={{ mb: '1rem' }}
        fullWidth
        label={trans('vehicleForm.name.label')}
        placeholder={trans('vehicleForm.name.placeholder')}
        value={formRepresentation.name.value || ''}
        helperText={formRepresentation.name.error}
        error={!!formRepresentation.name.error}
        onChange={(e) => setValue({ field: 'name', value: e.target.value })}
        disabled={disabled}
      />
      <Box sx={{ mb: '1rem' }} />
      <TextField
        sx={{ mb: '1rem' }}
        fullWidth
        label={trans('vehicleForm.registrationNumber.label')}
        placeholder={trans('vehicleForm.registrationNumber.placeholder')}
        value={formRepresentation.registration_number.value || ''}
        helperText={formRepresentation.registration_number.error}
        error={!!formRepresentation.registration_number.error}
        onChange={(e) => setValue({ field: 'registration_number', value: e.target.value })}
        disabled={disabled}
      />
    </BorderedBox>
  );
}
