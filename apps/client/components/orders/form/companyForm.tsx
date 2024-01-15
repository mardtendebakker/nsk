import {
  Box,
  Grid,
} from '@mui/material';
import useTranslation from '../../../hooks/useTranslation';
import { FormRepresentation, SetValue } from '../../../hooks/useForm';
import TextField from '../../memoizedInput/textField';
import useResponsive from '../../../hooks/useResponsive';
import DataSourcePicker from '../../memoizedInput/dataSourcePicker';
import Checkbox from '../../checkbox';
import Can from '../../can';
import { AUTOCOMPLETE_PARTNERS_PATH } from '../../../utils/axios';

function Form({ formRepresentation, disabled, setValue }: {
  formRepresentation : FormRepresentation,
  disabled: boolean,
  setValue: SetValue,
}) {
  const { trans } = useTranslation();
  const isDesktop = useResponsive('up', 'md');

  return (
    <Grid
      container
      spacing={1}
      sx={{ display: 'flex', flexDirection: 'column' }}
    >
      <Grid
        item
        xs={12}
        sx={{ display: 'flex', flex: 1, flexDirection: isDesktop ? 'row' : 'column' }}
      >
        <TextField
          sx={{ flex: 0.33 }}
          error={Boolean(formRepresentation.companyName.error)}
          helperText={formRepresentation.companyName.error}
          label={trans('companyForm.name.label')}
          placeholder={trans('companyForm.name.placeholder')}
          name="name"
          onChange={(e) => setValue({ field: 'companyName', value: e.target.value })}
          value={formRepresentation.companyName.value || ''}
          disabled={disabled}
        />
        <Box sx={{ m: '.25rem' }} />
        <TextField
          sx={{ flex: 0.33 }}
          type="number"
          error={Boolean(formRepresentation.companyKvkNr.error)}
          helperText={formRepresentation.companyKvkNr.error}
          label={trans('companyForm.kvk_nr.label')}
          placeholder={trans('companyForm.kvk_nr.placeholder')}
          name="kvk_nr"
          onChange={(e) => setValue({ field: 'companyKvkNr', value: e.target.value })}
          value={formRepresentation.companyKvkNr.value || ''}
          disabled={disabled}
        />
        <Can requiredGroups={['admin', 'super_admin', 'manager', 'logistics', 'local']}>
          <Box sx={{ m: '.25rem' }} />
          <Box sx={{ flex: 0.33, display: 'flex' }}>
            <Checkbox
              checked={formRepresentation.companyIsPartner.value}
              onCheck={(checked) => setValue({ field: 'companyIsPartner', value: checked })}
              label={trans('isPartner')}
            />
          </Box>
        </Can>
      </Grid>
      <Grid
        item
        xs={12}
        sx={{ display: 'flex', flex: 1, flexDirection: isDesktop ? 'row' : 'column' }}
      >
        <Can requiredGroups={['admin', 'super_admin', 'manager', 'logistics', 'local']}>
          {!formRepresentation.companyIsPartner.value && (
            <DataSourcePicker
              sx={{ flex: 0.33 }}
              label={trans('partner')}
              path={AUTOCOMPLETE_PARTNERS_PATH}
              disabled={disabled}
              fullWidth
              placeholder={trans('selectPartner')}
              value={formRepresentation.companyPartner.value}
              onChange={(value: { id: number }) => setValue({ field: 'companyPartner', value: value?.id || null })}
            />
          )}
        </Can>
      </Grid>
    </Grid>
  );
}

export default Form;
