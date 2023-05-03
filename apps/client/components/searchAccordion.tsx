import {
  Accordion, Box, AccordionSummary, AccordionDetails, Button, Divider,
} from '@mui/material';
import Search from '@mui/icons-material/Search';
import ChevronRight from '@mui/icons-material/ChevronRight';
import { useState } from 'react';
import useTranslation from '../hooks/useTranslation';
import MemoizedTextField from './memoizedInput/textField';
import debounce from '../utils/debounce';

export default function SearchAccordion({
  children,
  debounceSearchChanged,
  disabled,
  searchValue,
  searchLabel,
  onSearchChanged,
}: {
  children: JSX.Element,
  debounceSearchChanged?: boolean,
  disabled?: boolean,
  searchValue: string,
  searchLabel?: string,
  onSearchChanged: (searchValue: string) => void
}) {
  const [showFilter, setShowFilter] = useState(false);
  const handleSearchChanged = debounce(onSearchChanged.bind(null));
  const { trans } = useTranslation();

  return (
    <Accordion expanded={showFilter}>
      <AccordionSummary sx={{ background: 'transparent !important' }}>
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
          <Search sx={{ color: '#7F8FA4' }} />
          <MemoizedTextField
            defaultValue={searchValue}
            value={debounceSearchChanged ? undefined : searchValue}
            disabled={disabled}
            name="search"
            placeholder={searchLabel || trans('search')}
            fullWidth
            onChange={(e) => {
              if (debounceSearchChanged) {
                handleSearchChanged(e.target.value);
              } else {
                onSearchChanged(e.target.value);
              }
            }}
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
        {children}
      </AccordionDetails>
    </Accordion>
  );
}

SearchAccordion.defaultProps = {
  searchLabel: undefined,
  disabled: false,
  debounceSearchChanged: false,
};
