import useTranslation from '../../../../hooks/useTranslation';
import { FormRepresentation, SetValue } from '../../../../hooks/useForm';
import BorderedBox from '../../../borderedBox';
import SearchAccordion from '../../../searchAccordion';

export default function Filter({
  disabled,
  formRepresentation,
  setValue,
  onReset,
}: {
  disabled: boolean,
  formRepresentation : FormRepresentation,
  setValue: SetValue,
  onReset: () => void
}) {
  const { trans } = useTranslation();

  return (
    <BorderedBox>
      <SearchAccordion
        searchLabel={trans('searchByCustomerNameOrEmail')}
        disabled={disabled}
        onSearchChange={(value: string) => setValue({ field: 'search', value })}
        searchValue={formRepresentation.search.value?.toString()}
        onReset={onReset}
        disabledFilter
      />
    </BorderedBox>
  );
}
