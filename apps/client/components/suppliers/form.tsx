import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  Typography,
} from '@mui/material';
import { trans } from 'itranslator';
import { SyntheticEvent } from 'react';
import { FormRepresentation, SetValue } from '../../hooks/useForm';
import TextField from '../memoizedFormInput/TextField';

function SupplierForm({
  formRepresentation,
  disabled,
  onSubmit,
  setValue,
}: {
  formRepresentation : FormRepresentation,
  disabled:boolean,
  onSubmit: (e: SyntheticEvent) => void,
  setValue: SetValue
}) {
  return (
    <form onSubmit={onSubmit}>
      <Card>
        <CardContent>
          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              xs={12}
              sx={{ display: 'flex', flex: 1, flexDirection: { xs: 'column', md: 'row' } }}
            >
              <TextField
                fullWidth
                error={Boolean(formRepresentation.name.error)}
                helperText={formRepresentation.name.error}
                label={trans('name')}
                name="name"
                onChange={(e) => setValue({ field: 'name', value: e.target.value })}
                value={formRepresentation.name.value}
                variant="outlined"
              />
              <Box sx={{ mx: 0.5, my: 0.5 }} />
              <TextField
                fullWidth
                error={Boolean(formRepresentation.representative.error)}
                helperText={formRepresentation.representative.error}
                label={trans('representative')}
                name="representative"
                onChange={(e) => setValue({ field: 'representative', value: e.target.value })}
                value={formRepresentation.representative.value}
                variant="outlined"
              />
              <Box sx={{ mx: 0.5, my: 0.5 }} />
              <TextField
                fullWidth
                error={Boolean(formRepresentation.partner.error)}
                helperText={formRepresentation.partner.error}
                label={trans('partner')}
                name="partner"
                onChange={(e) => setValue({ field: 'partner', value: e.target.value })}
                value={formRepresentation.partner.value}
                variant="outlined"
              />
            </Grid>
          </Grid>
        </CardContent>
        <CardContent>
          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              xs={12}
              sx={{ display: 'flex', flex: 1, flexDirection: { xs: 'column', md: 'row' } }}
            >
              <TextField
                fullWidth
                error={Boolean(formRepresentation.email.error)}
                helperText={formRepresentation.email.error}
                label={trans('email')}
                name="email"
                onChange={(e) => setValue({ field: 'email', value: e.target.value })}
                value={formRepresentation.email.value}
                variant="outlined"
              />
              <Box sx={{ mx: 0.5, my: 0.5 }} />
              <TextField
                fullWidth
                error={Boolean(formRepresentation.phone.error)}
                helperText={formRepresentation.phone.error}
                label={trans('phone')}
                name="phone"
                onChange={(e) => setValue({ field: 'phone', value: e.target.value })}
                value={formRepresentation.phone.value}
                variant="outlined"
              />
              <Box sx={{ mx: 0.5, my: 0.5 }} />
              <TextField
                fullWidth
                error={Boolean(formRepresentation.phone2.error)}
                helperText={formRepresentation.phone2.error}
                label={trans('phone2')}
                name="phone2"
                onChange={(e) => setValue({ field: 'phone2', value: e.target.value })}
                value={formRepresentation.phone2.value}
                variant="outlined"
              />
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <CardContent>
          <Typography
            sx={{ m: 1 }}
            variant="h4"
          >
            {trans('address')}
          </Typography>
          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              xs={12}
              sx={{ display: 'flex', flex: 1, flexDirection: { xs: 'column', md: 'row' } }}
            >
              <TextField
                fullWidth
                error={Boolean(formRepresentation.street.error)}
                helperText={formRepresentation.street.error}
                label={trans('street')}
                name="street"
                onChange={(e) => setValue({ field: 'street', value: e.target.value })}
                value={formRepresentation.street.value}
                variant="outlined"
              />
              <Box sx={{ mx: 0.5, my: 0.5 }} />
              <TextField
                fullWidth
                error={Boolean(formRepresentation.street_extra.error)}
                helperText={formRepresentation.street_extra.error}
                label={trans('street_extra')}
                name="street_extra"
                onChange={(e) => setValue({ field: 'street_extra', value: e.target.value })}
                value={formRepresentation.street_extra.value}
                variant="outlined"
              />
              <Box sx={{ mx: 0.5, my: 0.5 }} />
              <TextField
                fullWidth
                error={Boolean(formRepresentation.city.error)}
                helperText={formRepresentation.city.error}
                label={trans('city')}
                name="city"
                onChange={(e) => setValue({ field: 'city', value: e.target.value })}
                value={formRepresentation.city.value}
                variant="outlined"
              />
            </Grid>

            <Grid
              item
              xs={12}
              sx={{ display: 'flex', flex: 1, flexDirection: { xs: 'column', md: 'row' } }}
            >
              <TextField
                fullWidth
                error={Boolean(formRepresentation.country.error)}
                helperText={formRepresentation.country.error}
                label={trans('country')}
                name="country"
                onChange={(e) => setValue({ field: 'country', value: e.target.value })}
                value={formRepresentation.country.value}
                variant="outlined"
              />
              <Box sx={{ mx: 0.5, my: 0.5 }} />
              <TextField
                fullWidth
                error={Boolean(formRepresentation.state.error)}
                helperText={formRepresentation.state.error}
                label={trans('state')}
                name="state"
                onChange={(e) => setValue({ field: 'state', value: e.target.value })}
                value={formRepresentation.state.value}
                variant="outlined"
              />
              <Box sx={{ mx: 0.5, my: 0.5 }} />
              <TextField
                fullWidth
                error={Boolean(formRepresentation.zip.error)}
                helperText={formRepresentation.zip.error}
                label={trans('zipcode')}
                name="zip"
                onChange={(e) => setValue({ field: 'zip', value: e.target.value })}
                value={formRepresentation.zip.value}
                variant="outlined"
              />
            </Grid>
          </Grid>

        </CardContent>
        <Divider />
        <CardContent>
          <Typography
            sx={{ m: 1 }}
            variant="h4"
          >
            {trans('extraAddress')}
          </Typography>
          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              xs={12}
              sx={{ display: 'flex', flex: 1, flexDirection: { xs: 'column', md: 'row' } }}
            >
              <TextField
                fullWidth
                error={Boolean(formRepresentation.street2.error)}
                helperText={formRepresentation.street2.error}
                label={trans('street')}
                name="street2"
                onChange={(e) => setValue({ field: 'street2', value: e.target.value })}
                value={formRepresentation.street2.value}
                variant="outlined"
              />
              <Box sx={{ mx: 0.5, my: 0.5 }} />
              <TextField
                fullWidth
                error={Boolean(formRepresentation.street_extra2.error)}
                helperText={formRepresentation.street_extra2.error}
                label={trans('street_extra')}
                name="street_extra2"
                onChange={(e) => setValue({ field: 'street_extra2', value: e.target.value })}
                value={formRepresentation.street_extra2.value}
                variant="outlined"
              />
              <Box sx={{ mx: 0.5, my: 0.5 }} />
              <TextField
                fullWidth
                error={Boolean(formRepresentation.city2.error)}
                helperText={formRepresentation.city2.error}
                label={trans('city')}
                name="city2"
                onChange={(e) => setValue({ field: 'city2', value: e.target.value })}
                value={formRepresentation.city2.value}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              xs={12}
              sx={{ display: 'flex', flex: 1, flexDirection: { xs: 'column', md: 'row' } }}
            >
              <TextField
                fullWidth
                error={Boolean(formRepresentation.country2.error)}
                helperText={formRepresentation.country2.error}
                label={trans('country')}
                name="country2"
                onChange={(e) => setValue({ field: 'country2', value: e.target.value })}
                value={formRepresentation.country2.value}
                variant="outlined"
              />
              <Box sx={{ mx: 0.5, my: 0.5 }} />
              <TextField
                fullWidth
                error={Boolean(formRepresentation.state2.error)}
                helperText={formRepresentation.state2.error}
                label={trans('state')}
                name="state2"
                onChange={(e) => setValue({ field: 'state2', value: e.target.value })}
                value={formRepresentation.state2.value}
                variant="outlined"
              />
              <Box sx={{ mx: 0.5, my: 0.5 }} />
              <TextField
                fullWidth
                error={Boolean(formRepresentation.zip2.error)}
                helperText={formRepresentation.zip2.error}
                label={trans('zipcode')}
                name="zip2"
                onChange={(e) => setValue({ field: 'zip2', value: e.target.value })}
                value={formRepresentation.zip2.value}
                variant="outlined"
              />
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            p: 2,
          }}
        >
          <Button
            type="submit"
            disabled={disabled}
            color="primary"
            variant="contained"
          >
            {trans('save')}
          </Button>
        </Box>
      </Card>
    </form>
  );
}

export default SupplierForm;
