import { Box, Grid, Typography } from '@mui/material';
import useTranslation from '../../../hooks/useTranslation';
import { FormRepresentation, SetValue } from '../../../hooks/useForm';
import TextField from '../../memoizedInput/textField';

export default function RepairDetails({
  formRepresentation,
  disabled,
  setValue,
}: {
  formRepresentation : FormRepresentation,
  disabled:boolean,
  setValue: SetValue,
}) {
  const { trans } = useTranslation();

  return (
    <>
      <Typography
        sx={{ mb: '1rem' }}
        variant="h4"
      >
        {trans('repairDetails')}
      </Typography>
      <Grid
        container
        spacing={1}
        sx={{ flexDirection: 'column' }}
      >
        <Grid sx={{ display: 'flex', flexDirection: 'column' }} item>
          <TextField
            disabled={disabled}
            fullWidth
            size="medium"
            multiline
            rows={3}
            label={trans('damage')}
            placeholder={trans('damage')}
            type="text"
            onChange={(e) => setValue({ field: 'repairDamage', value: e.target.value })}
            value={formRepresentation.repairDamage.value || ''}
          />
          <Box sx={{ m: '.25rem' }} />
          <TextField
            disabled={disabled}
            fullWidth
            size="medium"
            multiline
            rows={3}
            label={trans('description')}
            placeholder={trans('description')}
            type="text"
            onChange={(e) => setValue({ field: 'repairDescription', value: e.target.value })}
            value={formRepresentation.repairDescription.value || ''}
          />
        </Grid>
      </Grid>
    </>
  );
}
