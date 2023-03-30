import {
  Accordion, Box, AccordionSummary, AccordionDetails, Button, Divider,
} from '@mui/material';
import Search from '@mui/icons-material/Search';
import ChevronRight from '@mui/icons-material/ChevronRight';
import { useState } from 'react';
import BorderedBox from '../../../borderedBox';
import MemoizedTextField from '../../../memoizedFormInput/textField';
import Autocomplete from '../../../memoizedFormInput/autocomplete';
import useTranslation from '../../../../hooks/useTranslation';
import { FormRepresentation, SetValue } from '../../../../hooks/useForm';
import TextField from '../../../textField';
import ProductTypePicker from '../../../memoizedFormInput/productTypePicker';
import TastStatusPicker from '../../../memoizedFormInput/taskStatusPicker';

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
              <ProductTypePicker
                displayFieldset={false}
                label=""
                fullWidth
                disabled={disabled}
                value={[].find(({ id }) => id === formRepresentation.type.value) || null}
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
                value={[].find(({ id }) => id === formRepresentation.assignedTo.value) || null}
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
              <Box sx={(theme) => ({
                m: '1.25rem', width: '1px', height: '2.5rem', background: theme.palette.divider,
              })}
              />
              <Autocomplete
                disabled={disabled}
                fullWidth
                size="small"
                options={[]}
                value={[].find(({ id }) => id === formRepresentation.sortBy.value) || null}
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
            </Box>
          </AccordionDetails>
        </Accordion>
      </BorderedBox>
    </form>
  );
}
