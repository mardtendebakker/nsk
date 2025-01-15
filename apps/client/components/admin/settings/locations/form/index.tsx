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
        label={trans('locationForm.name.label')}
        placeholder={trans('locationForm.name.placeholder')}
        value={formRepresentation.name.value || ''}
        helperText={formRepresentation.name.error}
        error={!!formRepresentation.name.error}
        onChange={(e) => setValue({ field: 'name', value: e.target.value })}
        disabled={disabled}
      />
      <ChipsInput
        label={trans('locationForm.zipcodes.label')}
        placeholder={trans('locationForm.zipcodes.placeholder')}
        value={formRepresentation.zipcodes.value || []}
        onChange={(value) => setValue({ field: 'zipcodes', value })}
        fullWidth
      />
      <Box sx={{ mb: '1rem' }} />
      <ChipsInput
        label={trans('locationForm.locationTemplate.label')}
        placeholder={trans('locationForm.locationTemplate.placeholder')}
        value={formRepresentation.location_template.value || []}
        onChange={(value) => setValue({ field: 'location_template', value })}
        fullWidth
      />
    </BorderedBox>
  );
}
