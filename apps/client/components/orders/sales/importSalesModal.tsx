import { Box, Typography } from '@mui/material';
import ConfirmationDialog from '../../confirmationDialog';
import DataSourcePicker from '../../memoizedInput/dataSourcePicker';
import { AUTOCOMPLETE_COMPANIES_PATH, SALES_IMPORT_PATH } from '../../../utils/axios';
import useForm from '../../../hooks/useForm';
import useTranslation from '../../../hooks/useTranslation';
import useAxios from '../../../hooks/useAxios';

const initState = {
  file: { required: true },
  partner_id: {},
};

export default function ImportSalesModal({
  onClose,
  onConfirm,
  open,
}: {
  onClose: () => void,
  onConfirm: () => void,
  open: boolean
}) {
  const {
    formRepresentation, setValue, setData, validate,
  } = useForm(initState);
  const { trans } = useTranslation();
  const { call, performing } = useAxios('post', SALES_IMPORT_PATH, { showSuccessMessage: true, withProgressBar: true });

  const handleConfirm = () => {
    if (validate()) {
      return;
    }

    const body = new FormData();
    if (formRepresentation.partner_id.value) {
      body.append('partner_id', formRepresentation.partner_id.value);
    }

    if (formRepresentation.file.value) {
      body.append('file', formRepresentation.file.value);
    }

    call({ body, headers: { 'Content-Type': 'multipart/form-data' } })
      .then(() => {
        onConfirm();
        setData(initState);
      });
  };

  return (
    <ConfirmationDialog
      open={open}
      title={<>{trans('importSales')}</>}
      onClose={() => {
        onClose();
        setData(initState);
      }}
      onConfirm={handleConfirm}
      disabled={performing}
      content={(
        <Box sx={{ width: '30rem' }}>
          <form onSubmit={(e) => { e.preventDefault(); }}>
            <input
              type="file"
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              disabled={performing}
              onChange={(e) => {
                const file = (e.target as HTMLInputElement).files[0];
                setValue({ field: 'file', value: file });
              }}
            />
            <Typography color="error">{formRepresentation.file.error}</Typography>
            <DataSourcePicker
              sx={{ mt: '.5rem' }}
              url={AUTOCOMPLETE_COMPANIES_PATH}
              params={{ partnerOnly: '1' }}
              disabled={performing}
              fullWidth
              placeholder={trans('selectPartner')}
              onChange={(value: { id: number }) => {
                setValue({ field: 'partner_id', value: value?.id });
              }}
              value={formRepresentation.partner_id.value}
            />
          </form>
        </Box>
      )}
    />
  );
}
