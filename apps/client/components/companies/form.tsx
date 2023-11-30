import {
  Box,
  CardContent,
  Grid,
  Typography,
} from '@mui/material';
import useTranslation from '../../hooks/useTranslation';
import { FormRepresentation, SetValue } from '../../hooks/useForm';
import TextField from '../memoizedInput/textField';
import useResponsive from '../../hooks/useResponsive';

function Form({ formRepresentation, disabled, setValue }: {
  formRepresentation : FormRepresentation,
  disabled: boolean,
  setValue: SetValue,
}) {
  const { trans } = useTranslation();
  const isDesktop = useResponsive('up', 'md');

  return (
    <CardContent>
      <Typography
        sx={{ mb: '2rem' }}
        variant="h4"
      >
        {trans('basicDetails')}
      </Typography>
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
            error={Boolean(formRepresentation.name.error)}
            helperText={formRepresentation.name.error}
            label={trans('companyForm.name.label')}
            placeholder={trans('companyForm.name.placeholder')}
            name="name"
            onChange={(e) => setValue({ field: 'name', value: e.target.value })}
            value={formRepresentation.name.value || ''}
            disabled={disabled}
          />
          <Box sx={{ m: '.25rem' }} />
          <TextField
            sx={{ flex: 0.33 }}
            type="number"
            error={Boolean(formRepresentation.kvk_nr.error)}
            helperText={formRepresentation.kvk_nr.error}
            label={trans('companyForm.kvk_nr.label')}
            placeholder={trans('companyForm.kvk_nr.placeholder')}
            name="kvk_nr"
            onChange={(e) => setValue({ field: 'kvk_nr', value: e.target.value })}
            value={formRepresentation.kvk_nr.value || ''}
            disabled={disabled}
          />
        </Grid>
      </Grid>
    </CardContent>
  );
}

export default Form;
