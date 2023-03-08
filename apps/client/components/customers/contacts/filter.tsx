import {
  Accordion, Box, AccordionSummary, AccordionDetails, Button, Divider,
} from '@mui/material';
import Search from '@mui/icons-material/Search';
import ChevronRight from '@mui/icons-material/ChevronRight';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import moment from 'moment';
import { useState } from 'react';
import MemoizedTextField from '../../memoizedFormInput/TextField';
import Autocomplete from '../../memoizedFormInput/Autocomplete';
import useTranslation from '../../../hooks/useTranslation';
import { FormRepresentation, SetValue } from '../../../hooks/useForm';
import TextField from '../../textField';

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
      <Box sx={(theme) => ({
        border: `1px solid ${theme.palette.grey[30]}`,
        borderRadius: '0.5rem',
        px: '.5rem',
      })}
      >
        <Accordion expanded={showFilter}>
          <AccordionSummary sx={{ background: 'transparent !important' }}>
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
              <Search sx={{ color: '#7F8FA4' }} />
              <MemoizedTextField
                disabled={disabled}
                name="search"
                placeholder={trans('searchByCustomerNameOrEmail')}
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
              <Autocomplete
                disabled={disabled}
                fullWidth
                size="small"
                options={[]}
                filterSelectedOptions
                renderInput={
                (params) => (
                  <TextField
                    {...params}
                    placeholder={trans('list')}
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
                m: '1.25rem', width: '1px', height: '2.5rem', background: theme.palette.grey[30],
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
                value={[].find(({ id }) => id === formRepresentation.status.value) || null}
                // isOptionEqualToValue={(option, value) => option.id === value?.id}
                filterSelectedOptions
                renderInput={
                (params) => (
                  <TextField
                    {...params}
                    placeholder={trans('tags')}
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
                m: '1.25rem', width: '1px', height: '2.5rem', background: theme.palette.grey[30],
              })}
              />
              <MemoizedTextField
                disabled={disabled}
                name="search"
                placeholder={trans('representative')}
                fullWidth
                value={formRepresentation.representative.value}
                onChange={(e) => setValue({ field: 'representative', value: e.target.value })}
                type="text"
                sx={{
                  fieldset: {
                    display: 'none',
                  },
                }}
              />
              <Box sx={(theme) => ({
                m: '1.25rem', width: '1px', height: '2.5rem', background: theme.palette.grey[30],
              })}
              />
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
            </Box>
          </AccordionDetails>
        </Accordion>
      </Box>
    </form>
  );
}
