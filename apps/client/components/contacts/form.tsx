import {
  Box,
  Card,
  CardContent,
  Divider,
  Grid,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { AUTOCOMPLETE_COMPANIES_PATH } from '../../utils/axios';
import useTranslation from '../../hooks/useTranslation';
import { FormRepresentation, SetValue } from '../../hooks/useForm';
import TextField from '../memoizedInput/textField';
import DataSourcePicker from '../memoizedInput/dataSourcePicker';
import useResponsive from '../../hooks/useResponsive';

function Form({
  formRepresentation,
  disabled,
  setValue,
}: {
  formRepresentation : FormRepresentation,
  disabled:boolean,
  setValue: SetValue
}) {
  const { trans } = useTranslation();
  const isDesktop = useResponsive('up', 'md');
  const [company, setCompany] = useState<{ kvk_nr: number }>();

  return (
    <Card>
      <CardContent>
        <Typography
          sx={{ mb: '2rem' }}
          variant="h4"
        >
          {trans('company')}
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
            <DataSourcePicker
              sx={{ flex: 0.33 }}
              path={AUTOCOMPLETE_COMPANIES_PATH}
              label={trans('contactForm.company.label')}
              placeholder={trans('contactForm.company.placeholder')}
              onChange={(value: { id: number }) => {
                setValue({ field: 'company_id', value: value?.id });
              }}
              onCurrentValueChange={setCompany}
              value={formRepresentation.company_id.value}
              disabled={disabled || !!formRepresentation.id.value}
              error={Boolean(formRepresentation.company_id.error)}
              helperText={formRepresentation.company_id.error}
              fetchWhileDisabled
            />
            <Box sx={{ m: '.25rem' }} />
            {company && (
            <TextField
              sx={{ flex: 0.33 }}
              label={trans('kvk_nr')}
              name="kvk_nr"
              value={company.kvk_nr || ''}
              disabled
            />
            )}
          </Grid>
        </Grid>
      </CardContent>
      <Divider sx={{ mx: '1.5rem' }} />
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
              sx={{ flex: 0.25 }}
              error={Boolean(formRepresentation.name.error)}
              helperText={formRepresentation.name.error}
              label={trans('contactForm.name.label')}
              placeholder={trans('contactForm.name.placeholder')}
              name="name"
              onChange={(e) => setValue({ field: 'name', value: e.target.value })}
              value={formRepresentation.name.value || ''}
              disabled={disabled}
            />
            <Box sx={{ m: '.25rem' }} />
            <TextField
              sx={{ flex: 0.25 }}
              error={Boolean(formRepresentation.email.error)}
              helperText={formRepresentation.email.error}
              label={trans('contactForm.email.label')}
              placeholder={trans('contactForm.email.placeholder')}
              name="email"
              type="email"
              onChange={(e) => setValue({ field: 'email', value: e.target.value })}
              value={formRepresentation.email.value || ''}
              disabled={disabled}
            />
            <Box sx={{ m: '.25rem' }} />
            <TextField
              sx={{ flex: 0.25 }}
              error={Boolean(formRepresentation.phone.error)}
              helperText={formRepresentation.phone.error}
              label={trans('contactForm.phone.label')}
              placeholder={trans('contactForm.phone.placeholder')}
              name="phone"
              onChange={(e) => setValue({ field: 'phone', value: e.target.value })}
              value={formRepresentation.phone.value || ''}
              disabled={disabled}
            />
            <Box sx={{ m: '.25rem' }} />
            <TextField
              sx={{ flex: 0.25 }}
              error={Boolean(formRepresentation.phone2.error)}
              helperText={formRepresentation.phone2.error}
              label={trans('contactForm.phone2.label')}
              placeholder={trans('contactForm.phone2.placeholder')}
              name="phone2"
              onChange={(e) => setValue({ field: 'phone2', value: e.target.value })}
              value={formRepresentation.phone2.value || ''}
              disabled={disabled}
            />
          </Grid>
        </Grid>
      </CardContent>
      <Divider sx={{ mx: '1.5rem' }} />
      <CardContent>
        <Typography
          sx={{ mb: '2rem' }}
          variant="h4"
        >
          {trans('addressDetails')}
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
              sx={{ flex: 0.5 }}
              error={Boolean(formRepresentation.street.error)}
              helperText={formRepresentation.street.error}
              label={trans('contactForm.street.label')}
              placeholder={trans('contactForm.street.placeholder')}
              name="street"
              onChange={(e) => setValue({ field: 'street', value: e.target.value })}
              value={formRepresentation.street.value || ''}
              disabled={disabled}
            />
            <Box sx={{ m: '.25rem' }} />
            <TextField
              sx={{ flex: 0.5 }}
              error={Boolean(formRepresentation.street_extra.error)}
              helperText={formRepresentation.street_extra.error}
              label={trans('contactForm.extraStreet.label')}
              placeholder={trans('contactForm.extraStreet.placeholder')}
              name="street_extra"
              onChange={(e) => setValue({ field: 'street_extra', value: e.target.value })}
              value={formRepresentation.street_extra.value || ''}
              disabled={disabled}
            />
          </Grid>
          <Grid
            item
            xs={12}
            sx={{ display: 'flex', flex: 1, flexDirection: isDesktop ? 'row' : 'column' }}
          >
            <TextField
              sx={{ flex: 0.25 }}
              error={Boolean(formRepresentation.city.error)}
              helperText={formRepresentation.city.error}
              label={trans('contactForm.city.label')}
              placeholder={trans('contactForm.city.placeholder')}
              name="city"
              onChange={(e) => setValue({ field: 'city', value: e.target.value })}
              value={formRepresentation.city.value || ''}
              disabled={disabled}
            />
            <Box sx={{ m: '.25rem' }} />
            <TextField
              sx={{ flex: 0.25 }}
              error={Boolean(formRepresentation.zip.error)}
              helperText={formRepresentation.zip.error}
              label={trans('contactForm.zipcode.label')}
              placeholder={trans('contactForm.zipcode.placeholder')}
              name="zip"
              onChange={(e) => setValue({ field: 'zip', value: e.target.value })}
              value={formRepresentation.zip.value || ''}
              disabled={disabled}
            />
            <Box sx={{ m: '.25rem' }} />
            <TextField
              sx={{ flex: 0.25 }}
              error={Boolean(formRepresentation.state.error)}
              helperText={formRepresentation.state.error}
              label={trans('contactForm.state.label')}
              placeholder={trans('contactForm.state.placeholder')}
              name="state"
              onChange={(e) => setValue({ field: 'state', value: e.target.value })}
              value={formRepresentation.state.value || ''}
              disabled={disabled}
            />
            <Box sx={{ m: '.25rem' }} />
            <TextField
              sx={{ flex: 0.25 }}
              error={Boolean(formRepresentation.country.error)}
              helperText={formRepresentation.country.error}
              label={trans('contactForm.country.label')}
              placeholder={trans('contactForm.country.placeholder')}
              name="country"
              onChange={(e) => setValue({ field: 'country', value: e.target.value })}
              value={formRepresentation.country.value || ''}
              disabled={disabled}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default Form;
