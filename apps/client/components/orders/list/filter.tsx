import { Box } from '@mui/material';
import { format } from 'date-fns';
import BorderedBox from '../../borderedBox';
import Autocomplete from '../../memoizedInput/autocomplete';
import useTranslation from '../../../hooks/useTranslation';
import { FormRepresentation, SetValue } from '../../../hooks/useForm';
import TextField from '../../input/textField';
import DataSourcePicker from '../../memoizedInput/dataSourcePicker';
import { AUTOCOMPLETE_CONTACTS_PATH, AUTOCOMPLETE_PARTNERS_PATH } from '../../../utils/axios';
import SearchAccordion from '../../searchAccordion';
import useResponsive from '../../../hooks/useResponsive';
import ListFilterDivider from '../../listFilterDivider';
import { OrderType } from '../../../utils/axios/models/types';
import { autocompleteOrderStatusesPathMapper } from '../../../utils/axios/helpers/typeMapper';
import Can from '../../can';
import DatePicker from '../../input/datePicker';

export default function Filter({
  type,
  disabled,
  formRepresentation,
  setValue,
  onReset,
}: {
  type: OrderType,
  disabled: boolean,
  formRepresentation : FormRepresentation,
  setValue: SetValue,
  onReset: () => void
}) {
  const { trans } = useTranslation();
  const isDesktop = useResponsive('up', 'md');

  const ORDER_BY_OPTIONS = [
    {
      id: 'order_date:desc',
      name: trans('orderDate'),
    },
    {
      id: 'order_nr:desc',
      name: trans('orderNumber'),
    },
  ];

  return (
    <BorderedBox>
      <SearchAccordion
        disabled={disabled}
        onSearchChange={(value: string) => setValue({ field: 'search', value })}
        searchValue={formRepresentation.search.value?.toString() || ''}
        onReset={onReset}
      >
        <Box sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          flexDirection: isDesktop ? 'unset' : 'column',
        }}
        >
          <DatePicker
            disabled={disabled}
            value={formRepresentation.createdAt.value}
            placeholder={trans('createdAt')}
            onChange={(value) => {
              if (!value) {
                setValue({ field: 'createdAt', value });
              } else {
                setValue({ field: 'createdAt', value: format(new Date(value.toString()), 'yyyy/MM/dd') });
              }
            }}
          />
          <ListFilterDivider horizontal={!isDesktop} />
          <DataSourcePicker
            path={AUTOCOMPLETE_CONTACTS_PATH}
            disabled={disabled}
            fullWidth
            displayFieldset={false}
            placeholder={trans('createdBy')}
            onChange={(selected: { id: number }) => setValue({ field: 'createdBy', value: selected?.id })}
            value={formRepresentation.createdBy.value?.toString()}
          />
          <ListFilterDivider horizontal={!isDesktop} />
          <Autocomplete
            disabled={disabled}
            fullWidth
            size="small"
            getOptionLabel={({ name }: { name:string }) => name}
            value={
                  ORDER_BY_OPTIONS.find(({ id }) => id == formRepresentation.orderBy.value)
                  || null
                }
            onChange={(_, selected: { id: number }) => setValue({ field: 'orderBy', value: selected?.id })}
            options={ORDER_BY_OPTIONS}
            filterSelectedOptions
            renderInput={
                (params) => (
                  <TextField
                    {...params}
                    placeholder={trans('sortBy')}
                    sx={{
                      fieldset: {
                        display: 'none',
                      },
                    }}
                  />
                )
            }
          />
          <ListFilterDivider horizontal={!isDesktop} />
          <DataSourcePicker
            path={autocompleteOrderStatusesPathMapper(type)}
            disabled={disabled}
            fullWidth
            displayFieldset={false}
            placeholder={trans('status')}
            onChange={(selected: { id: number }) => setValue({ field: 'status', value: selected?.id })}
            value={formRepresentation.status.value?.toString()}
          />
          <Can requiredGroups={['admin', 'super_admin', 'manager', 'logistics', 'local']}>
            <ListFilterDivider horizontal={!isDesktop} />
            <DataSourcePicker
              path={AUTOCOMPLETE_PARTNERS_PATH}
              disabled={disabled}
              fullWidth
              displayFieldset={false}
              placeholder={trans('partner')}
              onChange={(selected: { id: number }) => setValue({ field: 'partner', value: selected?.id })}
              value={formRepresentation.partner.value?.toString()}
            />
          </Can>
        </Box>
      </SearchAccordion>
    </BorderedBox>
  );
}
