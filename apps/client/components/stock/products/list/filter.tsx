import {
  Accordion, Box, AccordionSummary, AccordionDetails, Button, Divider,
} from '@mui/material';
import Search from '@mui/icons-material/Search';
import ChevronRight from '@mui/icons-material/ChevronRight';
import { useState } from 'react';
import ProductAvailabilityPicker from '../../../memoizedInput/productAvailabilityPicker';
import BorderedBox from '../../../borderedBox';
import MemoizedTextField from '../../../memoizedInput/textField';
import Autocomplete from '../../../memoizedInput/autocomplete';
import useTranslation from '../../../../hooks/useTranslation';
import { FormRepresentation, SetValue } from '../../../../hooks/useForm';
import TextField from '../../../input/textField';
import TastStatusPicker from '../../../memoizedInput/taskStatusPicker';
import DataSourcePicker from '../../../memoizedInput/dataSourcePicker';
import { PRODUCT_TYPES_PATH, LOCATIONS_PATH } from '../../../../utils/axios/paths';

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
              <ProductAvailabilityPicker
                displayFieldset={false}
                label=""
                onChange={(selected) => setValue({ field: 'availability', value: selected?.id })}
                value={formRepresentation.availability.value?.toString()}
                fullWidth
                disabled={disabled}
              />
              <Box sx={(theme) => ({
                m: '1.25rem', width: '1px', height: '2.5rem', background: theme.palette.divider,
              })}
              />
              <DataSourcePicker
                url={PRODUCT_TYPES_PATH.replace(':id', '')}
                disabled={disabled}
                fullWidth
                displayFieldset={false}
                placeholder={trans('productType')}
                onChange={(selected: { id: number }) => setValue({ field: 'productType', value: selected?.id })}
                value={formRepresentation.productType.value?.toString()}
              />
              <Box sx={(theme) => ({
                m: '1.25rem', width: '1px', height: '2.5rem', background: theme.palette.divider,
              })}
              />
              <DataSourcePicker
                url={LOCATIONS_PATH.replace(':id', '')}
                disabled={disabled}
                fullWidth
                displayFieldset={false}
                placeholder={trans('location')}
                onChange={(selected: { id: number }) => setValue({ field: 'location', value: selected?.id })}
                value={formRepresentation.location.value?.toString()}
              />
              <Box sx={(theme) => ({
                m: '1.25rem', width: '1px', height: '2.5rem', background: theme.palette.divider,
              })}
              />
              <TastStatusPicker
                displayFieldset={false}
                label=""
                fullWidth
                disabled={disabled}
                value={[].find(({ id }) => id === formRepresentation.location.value) || null}
              />
              <Box sx={(theme) => ({
                m: '1.25rem', width: '1px', height: '2.5rem', background: theme.palette.divider,
              })}
              />
              <Autocomplete
                disabled={disabled}
                fullWidth
                size="small"
                options={[]}
            /*
            onChange={
            (_, option) => setValue({
               field: 'status', value: option?.id === undefined ? null : option.id }
               )}
           */
                value={[].find(({ id }) => id === formRepresentation.assignedTo.value) || null}
                // isOptionEqualToValue={(option, value) => option.id === value?.id}
                filterSelectedOptions
                renderInput={
                (params) => (
                  <TextField
                    {...params}
                    placeholder={trans('assignedTo')}
                    sx={{
                      fieldset: {
                        display: 'none',
                      },
                    }}
                  />
                )
            }
              />
            </Box>
          </AccordionDetails>
        </Accordion>
      </BorderedBox>
    </form>
  );
}
