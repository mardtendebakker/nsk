import { Box, Typography } from '@mui/material';
import ConfirmationDialog from '../../confirmationDialog';
import useTranslation from '../../../hooks/useTranslation';
import DataSourcePicker from '../../memoizedInput/dataSourcePicker';
import { AUTOCOMPLETE_PRODUCT_TYPES_PATH } from '../../../utils/axios';
import useForm from '../../../hooks/useForm';

export default function PatchProductTypeModal({ onSubmit, onClose } : {
  onSubmit: (arg0: { productTypeId: number }) => void,
  onClose: () => void
}) {
  const { trans } = useTranslation();
  const { formRepresentation, setValue, validate } = useForm({
    productTypeId: { required: true },
  });

  const handleSubmit = () => {
    if (validate()) {
      return;
    }

    onSubmit({
      productTypeId: formRepresentation.productTypeId.value,
    });
  };

  return (
    <ConfirmationDialog
      title={<>{trans('changeProductType')}</>}
      content={(
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          {trans('changeProductTypeContent')}
          <Box sx={{ pb: '.5rem' }} />
          <Typography color="red">{trans('changeProductTypeWarning')}</Typography>
          <Box sx={{ pb: '.5rem' }} />
          <DataSourcePicker
            path={AUTOCOMPLETE_PRODUCT_TYPES_PATH}
            searchKey="name"
            fullWidth
            placeholder={trans('selectProductType')}
            onChange={(selected: { id: number }) => {
              setValue({ field: 'productTypeId', value: selected?.id });
            }}
            helperText={formRepresentation.productTypeId.error}
            error={!!formRepresentation.productTypeId.error}
            value={formRepresentation.productTypeId.value}
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
