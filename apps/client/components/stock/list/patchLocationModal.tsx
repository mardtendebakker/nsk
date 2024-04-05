import { Box } from '@mui/material';
import { useMemo } from 'react';
import ConfirmationDialog from '../../confirmationDialog';
import useTranslation, { Trans } from '../../../hooks/useTranslation';
import DataSourcePicker from '../../memoizedInput/dataSourcePicker';
import TextField from '../../memoizedInput/textField';
import { AUTOCOMPLETE_LOCATIONS_PATH } from '../../../utils/axios';
import useForm, { FormRepresentation } from '../../../hooks/useForm';
import { LocationTemplate } from '../../../utils/axios/models/product';

const initFormState = (trans: Trans) => ({
  locationId: { additionalData: { location_template: [] }, required: true },
  locationLabel: {
    validator: (formRepresentation: FormRepresentation) => {
      const locationTemplates: LocationTemplate[] = formRepresentation.locationId.additionalData.location_template || [];
      if (locationTemplates.length == 0) {
        return undefined;
      }

      let supported = false;

      locationTemplates.forEach((element) => {
        if (new RegExp(element.template).test(formRepresentation.locationLabel.value)) {
          supported = true;
          return undefined;
        }
      });

      return supported ? undefined : trans('invalidLocationLabelFormat', { vars: new Map().set('e.g.', '0-0-00') });
    },
  },
});

export default function PatchLocationModal({ onSubmit, onClose } : {
  onSubmit: (arg0: { locationId: string, locationLabel?: string }) => void,
  onClose: () => void
}) {
  const { trans } = useTranslation();
  const { formRepresentation, setValue, validate } = useForm(useMemo(() => initFormState(trans), []));

  const handleSubmit = () => {
    if (validate()) {
      return;
    }

    onSubmit({
      locationId: formRepresentation.locationId.value,
      locationLabel: formRepresentation.locationLabel.value,
    });
  };

  return (
    <ConfirmationDialog
      title={<>{trans('changeLocation')}</>}
      content={(
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          {trans('changeLocationContent')}
          <Box sx={{ pb: '.5rem' }} />
          <DataSourcePicker
            path={AUTOCOMPLETE_LOCATIONS_PATH}
            searchKey="name"
            fullWidth
            placeholder={trans('selectLocation')}
            onChange={(selected: { id: number, location_template: LocationTemplate[] }) => {
              setValue({ field: 'locationId', value: selected?.id, additionalData: { location_template: selected?.location_template || [] } });
            }}
            helperText={formRepresentation.locationId.error}
            error={!!formRepresentation.locationId.error}
            value={formRepresentation.locationId.value}
          />
          <Box sx={{ pb: '.5rem' }} />
          <TextField
            fullWidth
            label={trans('locationLabel')}
            placeholder={trans('selectLocationLabel')}
            value={formRepresentation.locationLabel.value || ''}
            helperText={formRepresentation.locationLabel.error}
            error={!!formRepresentation.locationLabel.error}
            onChange={(e) => setValue({ field: 'locationLabel', value: e.target.value })}
            disabled={!formRepresentation.locationId.value}
          />
          <input type="submit" style={{ display: 'none' }} />
        </form>
    )}
      onConfirm={handleSubmit}
      onClose={onClose}
      confirmButtonText={trans('save')}
    />
  );
}
