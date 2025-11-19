import { Box } from '@mui/material';
import ConfirmationDialog from '../../confirmationDialog';
import useTranslation from '../../../hooks/useTranslation';
import useForm from '../../../hooks/useForm';
import ProductStatusDataSourcePicker from '../../memoizedInput/productStatusDataSourcePicker';

export default function PatchStatusModal({
  onSubmit,
  onClose,
}: {
  onSubmit: (arg0: { statusId: string }) => void;
  onClose: () => void;
}) {
  const { trans } = useTranslation();
  const { formRepresentation, setValue, validate } = useForm({
    statusId: { required: true },
  });

  const handleSubmit = () => {
    if (validate()) {
      return;
    }

    onSubmit({
      statusId: formRepresentation.statusId.value,
    });
  };

  return (
    <ConfirmationDialog
      title={<>{trans('changeStatus')}</>}
      content={
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          {trans('changeStatusContent')}
          <Box sx={{ pb: '.5rem' }} />
          <ProductStatusDataSourcePicker
            searchKey="name"
            fullWidth
            placeholder={trans('selectStatus')}
            onChange={(selected: { id: number }) => {
              setValue({ field: 'statusId', value: selected?.id });
            }}
            helperText={formRepresentation.statusId.error}
            error={!!formRepresentation.statusId.error}
            value={formRepresentation.statusId.value}
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
