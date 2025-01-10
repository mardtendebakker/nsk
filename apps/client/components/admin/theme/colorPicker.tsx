import {
  Box, SxProps, Tooltip, Typography,
} from '@mui/material';
import { memo } from 'react';
import debounce from '../../../utils/debounce';

function ColorPicker({
  label,
  palette,
  sx,
  onChange,
  disabled,
}:{
  palette: { [key: string]: string },
  label: string,
  sx: SxProps,
  disabled: boolean,
  onChange: (value: { [key: string]: string }) => void
}) {
  const handleChange = debounce((value: string, key: string) => {
    onChange({
      ...palette,
      [key]: value,
    });
  });

  return (
    <Box sx={sx}>
      <Typography variant="body1" color="text.secondary">{label}</Typography>
      <Box sx={{
        display: 'flex',
        border: (theme) => `1px solid ${theme.palette.divider}`,
        p: '.5rem',
        bgcolor: (theme) => theme.palette.grey[100],
        borderRadius: '.5rem',
      }}
      >
        {Object.keys(palette).map((key) => {
          const k = label + key;

          return (
            // eslint-disable-next-line jsx-a11y/label-has-associated-control
            <label htmlFor={k} key={k}>
              <input
                key={k}
                type="color"
                id={k}
                value={palette[key]}
                style={{ visibility: 'hidden', position: 'absolute' }}
                disabled={disabled}
                onChange={(e) => handleChange(e.target.value, key)}
              />
              <Tooltip title={key}>
                <Box
                  sx={{
                    bgcolor: palette[key],
                    width: '2rem',
                    height: '2rem',
                    borderRadius: '50%',
                    border: (theme) => `.5px solid ${theme.palette.divider}`,
                    cursor: 'pointer',
                    mr: '.5rem',
                  }}
                />
              </Tooltip>
            </label>
          );
        })}
      </Box>
    </Box>
  );
}

export default memo(
  ColorPicker,
  (prevProps, nextProps) => JSON.stringify(prevProps) === JSON.stringify(nextProps),
);
