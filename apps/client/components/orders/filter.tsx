import {
  Accordion, Box, AccordionSummary, AccordionDetails, Button, Divider,
} from '@mui/material';
import Search from '@mui/icons-material/Search';
import ChevronRight from '@mui/icons-material/ChevronRight';
import { useState } from 'react';
import { DesktopDatePicker } from '@mui/x-date-pickers';
import moment from 'moment';
import BorderedBox from '../borderedBox';
import MemoizedTextField from '../memoizedInput/textField';
import Autocomplete from '../memoizedInput/autocomplete';
import useTranslation from '../../hooks/useTranslation';
import { FormRepresentation, SetValue } from '../../hooks/useForm';
import TextField from '../input/textField';
import DataSourcePicker from '../memoizedInput/dataSourcePicker';
import { ORDER_STATUSES_PATH, COMPANIES_PATH } from '../../utils/axios/paths';

export default function Filter({
  disabled,
  formRepresentation,
  setValue,
}: {
  disabled: boolean,
  formRepresentation : FormRepresentation,
  setValue: SetValue
}) {
  const { trans } = useTranslation();
  const [showFilter, setShowFilter] = useState(false);
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
    <form>
      <BorderedBox>
        <Accordion expanded={showFilter}>
          <AccordionSummary sx={{ background: 'transparent !important' }}>
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
              <Search sx={{ color: '#7F8FA4' }} />
              <MemoizedTextField
                disabled={disabled}
                name="search"
                placeholder={trans('search')}
                fullWidth
                value={formRepresentation.search.value}
                onChange={(e) => setValue({ field: 'search', value: e.target.value })}
                type="text"
                sx={{
                  fieldset: {
                    display: 'none',
                  },
                }}
              />
              <Button variant="outlined" color="primary" onClick={() => setShowFilter((oldValue) => !oldValue)}>
                {trans('filter')}
                <ChevronRight sx={{ transform: `rotate(${showFilter ? '-90deg' : '90deg'})` }} />
              </Button>
            </Box>
          </AccordionSummary>
          <Divider />
          <AccordionDetails>
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
              <DesktopDatePicker
                disabled={disabled}
                inputFormat="YYYY/MM/DD"
                value={formRepresentation.createdAt.value}
                onChange={(value) => setValue({ field: 'createdAt', value: moment(value.toString()).format('YYYY/MM/DD') })}
                renderInput={(params) => (
                  <TextField
                    placeholder={trans('createdAt')}
                    fullWidth
                    size="small"
                    {...params}
                    inputProps={{
                      ...params.inputProps,
                      placeholder: trans('createdAt'),
                    }}
                    sx={{
                      fieldset: {
                        display: 'none',
                      },
                    }}
                  />
                )}
              />
              <Box sx={(theme) => ({
                m: '1.25rem', width: '1px', height: '2.5rem', background: theme.palette.divider,
              })}
              />
              <DataSourcePicker
                url={COMPANIES_PATH.replace(':id', '')}
                disabled={disabled}
                fullWidth
                displayFieldset={false}
                placeholder={trans('createdBy')}
                onChange={(selected: { id: number }) => setValue({ field: 'createdBy', value: selected?.id })}
                value={formRepresentation.createdBy.value?.toString()}
              />
              <Box sx={(theme) => ({
                m: '1.25rem', width: '1px', height: '2.5rem', background: theme.palette.divider,
              })}
              />
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
              <Box sx={(theme) => ({
                m: '1.25rem', width: '1px', height: '2.5rem', background: theme.palette.divider,
              })}
              />
              <DataSourcePicker
                url={ORDER_STATUSES_PATH.replace(':id', '')}
                disabled={disabled}
                fullWidth
                displayFieldset={false}
                placeholder={trans('status')}
                onChange={(selected: { id: number }) => setValue({ field: 'status', value: selected?.id })}
                value={formRepresentation.status.value?.toString()}
              />
              <Box sx={(theme) => ({
                m: '1.25rem', width: '1px', height: '2.5rem', background: theme.palette.divider,
              })}
              />
              <DataSourcePicker
                url={COMPANIES_PATH.replace(':id', '')}
                params={{ partnerOnly: '1' }}
                disabled={disabled}
                fullWidth
                displayFieldset={false}
                placeholder={trans('partner')}
                onChange={(selected: { id: number }) => setValue({ field: 'partner', value: selected?.id })}
                value={formRepresentation.partner.value?.toString()}
              />
            </Box>
          </AccordionDetails>
        </Accordion>
      </BorderedBox>
    </form>
  );
}
