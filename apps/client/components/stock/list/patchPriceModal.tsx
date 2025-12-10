import { Box } from '@mui/material';
import { useMemo } from 'react';
import ConfirmationDialog from '../../confirmationDialog';
import useTranslation from '../../../hooks/useTranslation';
import TextField from '../../memoizedInput/textField';
import useForm from '../../../hooks/useForm';

export default function PatchPriceModal({
  onSubmit,
  onClose,
}: {
  onSubmit: (arg0: { price: number }) => void;
  onClose: () => void;
}) {
  const { trans } = useTranslation();
  const defaultVatRate = 21;
  const defaultVatFactor = 1 + defaultVatRate / 100;

  const { formRepresentation, setValue, validate } = useForm(
    useMemo(
      () => ({
        price: { required: true },
        priceInclVat: {},
        vatFactor: { value: defaultVatFactor },
      }),
      []
    )
  );

  const handleSubmit = () => {
    if (validate()) {
      return;
    }

    onSubmit({
      price: parseFloat(formRepresentation.price.value),
    });
  };

  return (
    <ConfirmationDialog
      title={<>{trans('changePrice')}</>}
      content={
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          {trans('changePriceContent')}
          <Box sx={{ pb: '.5rem' }} />
          <TextField
            type="number"
            fullWidth
            label={trans('retailPriceExtVat')}
            placeholder="0.00"
            value={formRepresentation.price.value || ''}
            InputProps={{
              startAdornment: <Box sx={{ mr: '.2rem' }}>€</Box>,
            }}
            onChange={(e) => {
              setValue({ field: 'price', value: e.target.value });
              setValue({
                field: 'priceInclVat',
                value:
                  parseFloat(e.target.value || '0') *
                  formRepresentation.vatFactor.value,
              });
            }}
            helperText={formRepresentation.price.error}
            error={!!formRepresentation.price.error}
          />
          <Box sx={{ pb: '.5rem' }} />
          <TextField
            type="number"
            fullWidth
            label={trans('retailPriceInclVat')}
            placeholder="0.00"
            value={formRepresentation.priceInclVat.value || ''}
            InputProps={{
              startAdornment: <Box sx={{ mr: '.2rem' }}>€</Box>,
            }}
            onChange={(e) => {
              setValue({
                field: 'price',
                value:
                  parseFloat(e.target.value || '0') /
                  formRepresentation.vatFactor.value,
              });
              setValue({
                field: 'priceInclVat',
                value: e.target.value,
              });
            }}
          />
          <input type="submit" style={{ display: 'none' }} />
        </form>
      }
      onConfirm={handleSubmit}
      onClose={onClose}
      confirmButtonText={trans('save')}
    />
  );
}
