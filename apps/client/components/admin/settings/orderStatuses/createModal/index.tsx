import useAxios from '../../../../../hooks/useAxios';
import useTranslation from '../../../../../hooks/useTranslation';
import useForm, { FormRepresentation } from '../../../../../hooks/useForm';
import Form from '../form';
import { ORDER_STATUSES_PATH } from '../../../../../utils/axios';
import { OrderStatus } from '../../../../../utils/axios/models/order';
import ConfirmationDialog from '../../../../confirmationDialog';

export function initFormState(orderStatus?: OrderStatus) {
  return {
    name: { value: orderStatus?.name, required: true },
    color: { value: orderStatus?.color },
    isPurchase: { value: orderStatus?.is_purchase || false },
    isSale: { value: orderStatus?.is_sale || false },
    isRepair: { value: orderStatus?.is_repair || false },
    mailBody: { value: orderStatus?.mailbody },
  };
}

export function formRepresentationToBody(formRepresentation: FormRepresentation) {
  return {
    name: formRepresentation.name.value,
    color: formRepresentation.color.value,
    is_purchase: formRepresentation.isPurchase.value,
    is_sale: formRepresentation.isSale.value,
    is_repair: formRepresentation.isRepair.value,
    mailbody: formRepresentation.mailBody.value,
  };
}

const formState = initFormState();

export default function CreateModal({ onClose, onSubmit }: {
  onClose: () => void,
  onSubmit: () => void,
}) {
  const { trans } = useTranslation();
  const { formRepresentation, setValue, validate } = useForm(formState);

  const { call, performing } = useAxios('post', ORDER_STATUSES_PATH.replace(':id', ''), { showSuccessMessage: true, withProgressBar: true });

  const handleSave = () => {
    if (validate()) {
      return;
    }

    call({ body: formRepresentationToBody(formRepresentation) })
      .then(onSubmit);
  };

  return (
    <ConfirmationDialog
      open
      title={<>{trans('createOrderStatus')}</>}
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
