import { useState } from 'react';
import {
  Box, MenuItem, Stack, IconButton, Popover,
} from '@mui/material';
import useTranslation from '../../../hooks/useTranslation';

const LOCALES = [
  {
    value: 'nl',
    label: 'Netherlands',
    icon: '/assets/icons/ic_flag_nl.svg',
  },
  {
    value: 'en',
    label: 'English',
    icon: '/assets/icons/ic_flag_en.svg',
  },
  {
    value: 'de',
    label: 'Deutsch',
    icon: '/assets/icons/ic_flag_de.svg',
  },
];

export default function LanguagePopover() {
  const [open, setOpen] = useState(null);
  const { locale, updateLocale } = useTranslation();

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const usedLocale = LOCALES.find(({ value }) => locale === value);

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          p: 0,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
            },
          }),
        }}
      >
        <img src={usedLocale.icon} alt={usedLocale.label} width={30} height={20} />
      </IconButton>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,
            mt: 1.5,
            ml: 0.75,
            width: 180,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <Stack spacing={0.75}>
          {LOCALES.map((option, key) => (
            <MenuItem
              key={option.value}
              selected={option.value === usedLocale.value}
              onClick={() => {
                handleClose();
                updateLocale(LOCALES[key].value);
              }}
            >
              <Box component="img" alt={option.label} src={option.icon} sx={{ width: 28, mr: 2 }} />
              {option.label}
            </MenuItem>
          ))}
        </Stack>
      </Popover>
    </>
  );
}
