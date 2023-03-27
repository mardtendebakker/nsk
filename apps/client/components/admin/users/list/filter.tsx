import {
  Accordion, Box, AccordionSummary, AccordionDetails, Button, Divider,
} from '@mui/material';
import Search from '@mui/icons-material/Search';
import ChevronRight from '@mui/icons-material/ChevronRight';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import moment from 'moment';
import { useState } from 'react';
import UserRolePicker from 'apps/client/components/memoizedFormInput/userRolePicker';
import MemoizedTextField from '../../../memoizedFormInput/textField';
import Autocomplete from '../../../memoizedFormInput/autocomplete';
import useTranslation from '../../../../hooks/useTranslation';
import { FormRepresentation, SetValue } from '../../../../hooks/useForm';
import TextField from '../../../textField';
import BorderedBox from '../../../borderedBox';

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
              <UserRolePicker
                label=" "
                disabled={disabled}
                fullWidth
                sx={{
                  fieldset: {
                    display: 'none',
                  },
                }}
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
                filterSelectedOptions
                renderInput={
                (params) => (
                  <TextField
                    {...params}
                    placeholder={trans('lastActive')}
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
                filterSelectedOptions
                renderInput={
                (params) => (
                  <TextField
                    {...params}
                    placeholder={trans('createdBy')}
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
      </BorderedBox>
    </form>
  );
}
