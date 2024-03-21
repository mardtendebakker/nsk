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
  location_id: { additionalData: { location_template: [] }, required: true },
  location_label: {
    validator: (formRepresentation: FormRepresentation) => {
      const locationTemplates: LocationTemplate[] = formRepresentation.location_id.additionalData.location_template || [];
      if (locationTemplates.length == 0) {
        return undefined;
      }

      let supported = false;

      locationTemplates.forEach((element) => {
        if (new RegExp(element.template).test(formRepresentation.location_label.value)) {
          supported = true;
          return undefined;
        }
      });

      return supported ? undefined : trans('invalidLocationLabelFormat', { vars: new Map().set('e.g.', '0-0-00') });
    },
  },
});

export default function PatchLocationModal({ onSubmit, onClose } : {
  onSubmit: (arg0: { location_id: string, location_label?: string }) => void,
  onClose: () => void
}) {
  const { trans } = useTranslation();
  const { formRepresentation, setValue, validate } = useForm(useMemo(() => initFormState(trans), []));

  const handleSubmit = () => {
    if (validate()) {
      return;
    }

    onSubmit({
      location_id: formRepresentation.location_id.value,
      location_label: formRepresentation.location_label.value,
    });
  };

  return (
    <ConfirmationDialog
      title={<>{trans('changeLocation')}</>}
      content={(
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          {trans('changeLocationContent')}
          <DataSourcePicker
            path={AUTOCOMPLETE_LOCATIONS_PATH}
            searchKey="name"
            fullWidth
            placeholder={trans('selectLocation')}
            onChange={(selected: { id: number, location_template: LocationTemplate[] }) => {
              setValue({ field: 'location_id', value: selected?.id, additionalData: { location_template: selected?.location_template || [] } });
            }}
            helperText={formRepresentation.location_id.error}
            error={!!formRepresentation.location_id.error}
            value={formRepresentation.location_id.value}
          />
          <Box sx={{ pb: '.5rem' }} />
          <TextField
            fullWidth
            label={trans('locationLabel')}
            placeholder={trans('selectLocationLabel')}
            value={formRepresentation.location_label.value || ''}
            helperText={formRepresentation.location_label.error}
            error={!!formRepresentation.location_label.error}
            onChange={(e) => setValue({ field: 'location_label', value: e.target.value })}
            disabled={!formRepresentation.location_id.value}
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
