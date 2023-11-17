import useAxios from '../../../../../hooks/useAxios';
import useTranslation from '../../../../../hooks/useTranslation';
import useForm, { FormRepresentation } from '../../../../../hooks/useForm';
import Form from '../form';
import { PRODUCT_STATUSES_PATH } from '../../../../../utils/axios';
import { ProductStatus } from '../../../../../utils/axios/models/product';
import ConfirmationDialog from '../../../../confirmationDialog';

export function initFormState(productStatus?: ProductStatus) {
  return {
    name: { value: productStatus?.name, required: true },
    color: { value: productStatus?.color },
    isStock: { value: productStatus?.is_stock || false },
    isSaleable: { value: productStatus?.is_saleable || false },
  };
}

export function formRepresentationToBody(formRepresentation: FormRepresentation) {
  return {
    name: formRepresentation.name.value,
    color: formRepresentation.color.value,
    is_stock: formRepresentation.isStock.value,
    is_saleable: formRepresentation.isSaleable.value,
  };
}

const formState = initFormState();

export default function CreateModal({ onClose, onSubmit }: {
  onClose: () => void,
  onSubmit: () => void,
}) {
  const { trans } = useTranslation();
  const { formRepresentation, setValue, validate } = useForm(formState);

  const { call, performing } = useAxios('post', PRODUCT_STATUSES_PATH.replace(':id', ''), { showSuccessMessage: true, withProgressBar: true });

  const handleSave = () => {
    if (validate() || performing) {
      return;
    }

    call({ body: formRepresentationToBody(formRepresentation) })
      .then(onSubmit);
  };

  return (
    <ConfirmationDialog
      open
      title={<>{trans('createProductStatus')}</>}
      onClose={onClose}
      onConfirm={handleSave}
      disabled={performing}
      content={(
        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
          <Form setValue={setValue} formRepresentation={formRepresentation} disabled={performing} />
          <input type="submit" style={{ display: 'none' }} />
        </form>
      )}
    />
  );
}
