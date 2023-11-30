import { useRef } from 'react';
import useTranslation from '../../../hooks/useTranslation';
import { FormRepresentation, SetValue } from '../../../hooks/useForm';
import BorderedBox from '../../borderedBox';
import SearchAccordion from '../../searchAccordion';

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
  const nameInputRef = useRef<HTMLInputElement>(null);
  const { trans } = useTranslation();

  const handleReset = () => {
    onReset();
    nameInputRef.current.value = '';
  };

  return (
    <BorderedBox>
      <SearchAccordion
        searchLabel={trans('search')}
        disabled={disabled}
        onSearchChange={(value: string) => setValue({ field: 'search', value })}
        searchValue={formRepresentation.search.value?.toString() || ''}
        onReset={handleReset}
      >
        <div />
      </SearchAccordion>
    </BorderedBox>
  );
}
