import { Box } from '@mui/material';
import { SetValue, FormRepresentation } from '../../../../../hooks/useForm';
import useTranslation from '../../../../../hooks/useTranslation';
import BorderedBox from '../../../../borderedBox';
import TextField from '../../../../memoizedInput/textField';
import Checkbox from '../../../../checkbox';
import useResponsive from '../../../../../hooks/useResponsive';

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
  const isDesktop = useResponsive('up', 'md');

  return (
    <BorderedBox sx={{ p: '1rem' }}>
      <TextField
        sx={{ mb: '1rem' }}
        fullWidth
        label={trans('productStatusForm.name.label')}
        placeholder={trans('productStatusForm.name.placeholder')}
        value={formRepresentation.name.value || ''}
        helperText={formRepresentation.name.error}
        error={!!formRepresentation.name.error}
        onChange={(e) => setValue({ field: 'name', value: e.target.value })}
        disabled={disabled}
      />
      <input
        onChange={(e) => setValue({ field: 'color', value: e.target.value })}
        type="color"
        style={{ width: '10rem' }}
        value={formRepresentation.color.value || '#ffffff'}
      />
      <Box sx={{ display: 'flex', flexDirection: isDesktop ? undefined : 'column', mt: '.5rem' }}>
        <Checkbox
          disabled={disabled}
          onCheck={(checked) => setValue({ field: 'isStock', value: checked })}
          checked={formRepresentation.isStock.value as boolean}
          label={trans('stock')}
        />
        <Checkbox
          disabled={disabled}
          onCheck={(checked) => setValue({ field: 'isSaleable', value: checked })}
          checked={formRepresentation.isSaleable.value as boolean}
          label={trans('isSaleable')}
        />
      </Box>
    </BorderedBox>
  );
}
