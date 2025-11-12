import { Box, Typography } from '@mui/material';
import { SetValue, FormRepresentation } from '../../../../../hooks/useForm';
import useTranslation from '../../../../../hooks/useTranslation';
import BorderedBox from '../../../../borderedBox';
import TextField from '../../../../memoizedInput/textField';
import Checkbox from '../../../../checkbox';
import useResponsive from '../../../../../hooks/useResponsive';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'nl', label: 'Dutch' },
  { code: 'de', label: 'German' },
  { code: 'fr', label: 'French' },
  { code: 'es', label: 'Spanish' },
  { code: 'pt', label: 'Portuguese' },
  { code: 'ar', label: 'Arabic' },
  { code: 'fa', label: 'Farsi' },
];

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
        label={trans('name')}
        placeholder={trans('orderStatusForm.name.placeholder')}
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
      <Box sx={{
        display: 'flex', flexDirection: isDesktop ? undefined : 'column', mt: '.5rem',
      }}
      >
        <Checkbox
          disabled={disabled}
          onCheck={(checked) => setValue({ field: 'isPurchase', value: checked })}
          checked={formRepresentation.isPurchase.value as boolean}
          label={trans('purchase')}
        />
        <Checkbox
          disabled={disabled}
          onCheck={(checked) => setValue({ field: 'isSale', value: checked })}
          checked={formRepresentation.isSale.value as boolean}
          label={trans('sale')}
        />
        <Checkbox
          disabled={disabled}
          onCheck={(checked) => setValue({ field: 'isRepair', value: checked })}
          checked={formRepresentation.isRepair.value as boolean}
          label={trans('repair')}
        />
      </Box>
      <TextField
        sx={{ mt: '.5rem' }}
        minRows={3}
        multiline
        fullWidth
        label={trans('orderStatusForm.mailBody.label')}
        placeholder={trans('orderStatusForm.mailBody.placeholder')}
        value={formRepresentation.mailBody.value || ''}
        helperText={trans('orderStatusForm.mailBody.helperText')}
        onChange={(e) => setValue({ field: 'mailBody', value: e.target.value })}
        disabled={disabled}
      />
      <Typography sx={{ mx: '.8rem' }} variant="body1" color="text.secondary">{trans('orderStatusForm.mailBodyVariables.orderNr')}</Typography>
      <Typography sx={{ mx: '.8rem' }} variant="body1" color="text.secondary">{trans('orderStatusForm.mailBodyVariables.pickupDate')}</Typography>
      <Typography sx={{ mx: '.8rem' }} variant="body1" color="text.secondary">{trans('orderStatusForm.mailBodyVariables.deliveryData')}</Typography>
      <Typography sx={{ mx: '.8rem' }} variant="body1" color="text.secondary">{trans('orderStatusForm.mailBodyVariables.orderDate')}</Typography>
      <Typography sx={{ mx: '.8rem' }} variant="body1" color="text.secondary">{trans('orderStatusForm.mailBodyVariables.supplierName')}</Typography>
      <Typography sx={{ mx: '.8rem' }} variant="body1" color="text.secondary">{trans('orderStatusForm.mailBodyVariables.customerName')}</Typography>
      <Typography sx={{ mt: '1.5rem', mb: '.5rem' }} variant="h6">{trans('orderStatusForm.translations.label')}</Typography>
      {LANGUAGES.map((lang) => (
        <TextField
          key={lang.code}
          sx={{ mb: '1rem' }}
          fullWidth
          label={`${trans('name')} ${lang.label}`}
          placeholder={trans('orderStatusForm.translations.placeholder')}
          value={formRepresentation[`translation_${lang.code}`]?.value || ''}
          helperText={formRepresentation[`translation_${lang.code}`]?.error}
          error={!!formRepresentation[`translation_${lang.code}`]?.error}
          onChange={(e) => setValue({ field: `translation_${lang.code}`, value: e.target.value })}
          disabled={disabled}
        />
      ))}
    </BorderedBox>
  );
}
