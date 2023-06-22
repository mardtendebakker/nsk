import { Box, Checkbox, Typography } from '@mui/material';
import { SetValue, FormRepresentation } from '../../../../../hooks/useForm';
import useTranslation from '../../../../../hooks/useTranslation';
import BorderedBox from '../../../../borderedBox';
import TextField from '../../../../memoizedInput/textField';

export default function Form({
  setValue,
  formRepresentation,
  disabled,
}: {
  setValue: SetValue,
  formRepresentation: FormRepresentation
  disabled?: boolean
}) {
  const { trans } = useTranslation();

  return (
    <BorderedBox sx={{ width: '80rem', p: '1rem' }}>
      <TextField
        sx={{ mb: '2rem' }}
        fullWidth
        label={trans('productStatusForm.name.label')}
        placeholder={trans('productStatusForm.name.placeholder')}
        value={formRepresentation.name.value || ''}
        helperText={formRepresentation.name.error}
        error={!!formRepresentation.name.error}
        onChange={(e) => setValue({ field: 'name', value: e.target.value })}
        disabled={disabled}
      />
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <input
          onChange={(e) => setValue({ field: 'color', value: e.target.value })}
          type="color"
          style={{ width: '10rem' }}
          value={formRepresentation.color.value || '#ffffff'}
        />
        <Checkbox
          disabled={disabled}
          onChange={(_, checked) => setValue({ field: 'isStock', value: checked })}
          checked={formRepresentation.isStock.value as boolean}
        />
        <Typography variant="inherit" sx={{ mt: '.3rem' }}>
          {trans('stock')}
        </Typography>
        <Checkbox
          disabled={disabled}
          onChange={(_, checked) => setValue({ field: 'isSaleable', value: checked })}
          checked={formRepresentation.isSaleable.value as boolean}
        />
        <Typography variant="inherit" sx={{ mt: '.3rem' }}>
          {trans('saleable')}
        </Typography>
      </Box>
    </BorderedBox>
  );
}

Form.defaultProps = { disabled: false };
