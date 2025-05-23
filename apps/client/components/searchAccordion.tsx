import {
  Accordion, Box, AccordionSummary, AccordionDetails, Button, Divider,
} from '@mui/material';
import Search from '@mui/icons-material/Search';
import ChevronRight from '@mui/icons-material/ChevronRight';
import { useEffect, useRef, useState } from 'react';
import useTranslation from '../hooks/useTranslation';
import MemoizedTextField from './memoizedInput/textField';
import debounce from '../utils/debounce';

export default function SearchAccordion({
  children,
  searchValue,
  onSearchChange,
  onReset,
  searchLabel,
  disabled = false,
  disabledFilter = false,
  autoFocus = false,
}: {
  children?: JSX.Element,
  disabled?: boolean,
  searchValue: string,
  searchLabel?: string,
  onSearchChange: (searchValue: string) => void,
  onReset: () => void,
  disabledFilter?: boolean,
  autoFocus?: boolean
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [showFilter, setShowFilter] = useState(false);
  const handleSearchChange = debounce(onSearchChange.bind(null));
  const { trans } = useTranslation();

  useEffect(() => {
    if (searchValue || autoFocus) {
      inputRef.current?.focus();
    }
  });

  return (
    <Accordion expanded={showFilter}>
      <AccordionSummary sx={{ background: 'transparent !important', padding: '0 .1rem' }}>
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
          <Search sx={{ color: (theme) => theme.palette.grey[40] }} />
          <MemoizedTextField
            inputRef={inputRef}
            defaultValue={searchValue}
            disabled={disabled}
            name="search"
            placeholder={searchLabel || trans('search')}
            fullWidth
            onChange={(e) => { handleSearchChange(e.target.value); }}
            type="text"
            sx={{
              fieldset: {
                display: 'none',
              },
            }}
          />
          <Button
            size="small"
            variant="outlined"
            color="error"
            onClick={() => {
              onReset();
              if (inputRef.current?.value) {
                inputRef.current.value = '';
              }
            }}
            sx={{ mr: '.5rem', px: '1rem' }}
          >
            {trans('reset')}
          </Button>
          {!disabledFilter && (
          <Button size="small" variant="outlined" color="primary" onClick={() => setShowFilter((oldValue) => !oldValue)} sx={{ px: '1rem' }}>
            {trans('filter')}
            <ChevronRight sx={{ transform: `rotate(${showFilter ? '-90deg' : '90deg'})` }} />
          </Button>
          )}
        </Box>
      </AccordionSummary>
      {!disabledFilter && (
      <>
        <Divider />
        <AccordionDetails>
          {children}
        </AccordionDetails>
      </>
      )}
    </Accordion>
  );
}
