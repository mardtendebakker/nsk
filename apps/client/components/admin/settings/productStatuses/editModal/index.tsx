import { useEffect, useMemo } from 'react';
import useAxios from '../../../../../hooks/useAxios';
import useTranslation from '../../../../../hooks/useTranslation';
import useForm from '../../../../../hooks/useForm';
import Form from '../form';
import { PRODUCT_STATUSES_PATH } from '../../../../../utils/axios';
import { initFormState, formRepresentationToBody } from '../createModal';
import ConfirmationDialog from '../../../../confirmationDialog';

export default function EditModal({ onClose, onSubmit, id }: {
  onClose: () => void,
  onSubmit: () => void,
  id: string,
}) {
  const { trans } = useTranslation();

  const { data: productStatus, call, performing } = useAxios('get', PRODUCT_STATUSES_PATH.replace(':id', id));
  const { call: callPut, performing: performingPut } = useAxios('put', PRODUCT_STATUSES_PATH.replace(':id', id));
  const { formRepresentation, setValue, validate } = useForm(useMemo(() => initFormState(productStatus), [productStatus]));

  useEffect(() => {
    call().catch(onClose);
  }, []);

  const canSubmit = () => !performing && !performingPut;

  const handleSave = () => {
    if (validate() && !canSubmit()) {
      return;
    }

    callPut({ body: formRepresentationToBody(formRepresentation) })
      .then(onSubmit);
  };

  return (
    <ConfirmationDialog
      open
      title={<>{trans('editProductStatus')}</>}
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
