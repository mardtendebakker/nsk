import { useEffect, useMemo } from 'react';
import useTranslation from '../../../hooks/useTranslation';
import useForm from '../../../hooks/useForm';
import Form from '../form';
import { STOCK_PRODUCTS_PATH } from '../../../utils/axios';
import useAxios from '../../../hooks/useAxios';
import { formRepresentationToBody, initFormState } from '../createModal';
import ConfirmationDialog from '../../confirmationDialog';

export default function EditModal(
  {
    onClose,
    onSubmit,
    id,
  }: {
    onClose: () => void,
    onSubmit: () => void,
    id: string,
  },
) {
  const { trans } = useTranslation();

  const { data: product, call, performing } = useAxios('get', STOCK_PRODUCTS_PATH.replace(':id', id));

  const { call: callPut, performing: performingPut } = useAxios('put', STOCK_PRODUCTS_PATH.replace(':id', id));

  const { formRepresentation, setValue, validate } = useForm(useMemo(() => initFormState(product), [product]));

  useEffect(() => {
    call().catch(onClose);
  }, []);

  const canSubmit = () => !performing && !performingPut;

  const handleSave = () => {
    if (validate() && !canSubmit()) {
      return;
    }

    callPut({
      body: formRepresentationToBody(formRepresentation),
      headers: { 'Content-Type': 'multipart/form-data' },
    })
      .then(onSubmit);
  };

  return (
    <ConfirmationDialog
      open
      title={<>{trans('editProduct')}</>}
      onClose={onClose}
      onConfirm={handleSave}
      disabled={!canSubmit()}
      content={(
        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
          <Form setValue={setValue} formRepresentation={formRepresentation} disabled={!canSubmit()} />
          <input type="submit" style={{ display: 'none' }} />
        </form>
      )}
    />
  );
}
