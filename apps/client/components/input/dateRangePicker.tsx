import React, { useState, useEffect } from 'react';
import {
  Box,
  Popover,
  Paper,
  Typography,
  Button,
  Chip,
  Grid,
  IconButton,
  InputAdornment,
  SxProps,
} from '@mui/material';
import {
  LocalizationProvider,
  StaticDatePicker,
} from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  CalendarToday,
  Clear,
} from '@mui/icons-material';
import {
  format, isValid, isBefore, isAfter, startOfDay, endOfDay,
  addDays,
} from 'date-fns';
import TextField from './textField';
import useTranslation from '../../hooks/useTranslation';

interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

type ActiveField = 'start' | 'end';

function DateRangePicker({
  startDate,
  endDate,
  onChange,
  minDate,
  maxDate,
  disabled = false,
  label,
  format: dateFormat = 'MM/dd/yyyy',
  clearable,
  sx = {},
  maxDaysRange,
}: {
  startDate: Date | null;
  endDate: Date | null;
  onChange: (range: DateRange) => void;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  label?: string;
  format?: string;
  clearable?: boolean;
  maxDaysRange?: number;
  sx: SxProps
}) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [tempStartDate, setTempStartDate] = useState<Date | null>(startDate);
  const [tempEndDate, setTempEndDate] = useState<Date | null>(endDate);
  const [activeField, setActiveField] = useState<ActiveField>('start');
  const { trans } = useTranslation();

  const open = Boolean(anchorEl);

  useEffect(() => {
    setTempStartDate(startDate);
    setTempEndDate(endDate);
  }, [startDate, endDate]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (!disabled) {
      setAnchorEl(event.currentTarget);
    }
  };

  const isValidRange = (start: Date | null, end: Date | null): boolean => {
    if (!start || !end) return false;
    return isValid(start) && isValid(end) && !isAfter(start, end);
  };

  const handleClose = () => {
    setAnchorEl(null);
    if (!isValidRange(tempStartDate, tempEndDate)) {
      setTempStartDate(startDate);
      setTempEndDate(endDate);
    }
  };

  const handleDateChange = (newDate: Date | null) => {
    if (activeField === 'start') {
      setTempStartDate(newDate);
      if (tempEndDate && newDate && isAfter(newDate, tempEndDate)) {
        setTempEndDate(null);
      }
      if (newDate) {
        setActiveField('end');
      }
    } else {
      setTempEndDate(newDate);
    }
  };

  const handleApply = () => {
    onChange({
      startDate: tempStartDate,
      endDate: tempEndDate,
    });
    handleClose();
  };

  const handleClear = (event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation();
    }
    setTempStartDate(null);
    setTempEndDate(null);
    onChange({
      startDate: null,
      endDate: null,
    });
  };

  const formatDisplayValue = (): string => {
    if (startDate && endDate) {
      return `${format(startDate, dateFormat)} - ${format(endDate, dateFormat)}`;
    } if (startDate) {
      return `${format(startDate, dateFormat)} - End Date`;
    } if (endDate) {
      return `Start Date - ${format(endDate, dateFormat)}`;
    }
    return '';
  };

  const shouldDisableDate = (date: Date): boolean => {
    if (activeField === 'start') {
      return (
        (minDate !== undefined && isBefore(date, startOfDay(minDate)))
      || (maxDate !== undefined && isAfter(date, endOfDay(maxDate)))
      );
    }

    return (
      (minDate !== undefined && isBefore(date, startOfDay(minDate)))
    || (maxDate !== undefined && isAfter(date, endOfDay(maxDate)))
    || (tempStartDate !== null && isBefore(date, tempStartDate))
    || (maxDaysRange && (tempStartDate !== null && isAfter(date, addDays(tempStartDate, maxDaysRange))))
    );
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <TextField
        fullWidth
        label={label != undefined ? label : trans('selectDateRange')}
        value={formatDisplayValue()}
        onClick={handleClick}
        disabled={disabled}
        sx={sx}
        InputProps={{
          readOnly: true,
          endAdornment: (
            <InputAdornment position="end">
              {(startDate || endDate) && !disabled && clearable && (
                <IconButton
                  size="small"
                  onClick={handleClear}
                >
                  <Clear />
                </IconButton>
              )}
              <IconButton disabled={disabled}>
                <CalendarToday />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        PaperProps={{
          sx: { p: 2, minWidth: 320 },
        }}
      >
        <Paper elevation={0}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              {trans('selectDateRange')}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <Chip
                label={trans('startDate')}
                variant={activeField === 'start' ? 'filled' : 'outlined'}
                color={activeField === 'start' ? 'primary' : 'default'}
                onClick={() => setActiveField('start')}
                size="small"
              />
              <Chip
                label={trans('endDate')}
                variant={activeField === 'end' ? 'filled' : 'outlined'}
                color={activeField === 'end' ? 'primary' : 'default'}
                onClick={() => setActiveField('end')}
                size="small"
              />
            </Box>
          </Box>

          <Box sx={{
            mb: 2, p: 2, borderRadius: 1,
          }}
          >
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="caption" color="textSecondary">
                  {trans('startDate')}
                </Typography>
                <Typography variant="body2">
                  {tempStartDate ? format(tempStartDate, dateFormat) : trans('notSelected')}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="textSecondary">
                  {trans('endDate')}
                </Typography>
                <Typography variant="body2">
                  {tempEndDate ? format(tempEndDate, dateFormat) : trans('notSelected')}
                </Typography>
              </Grid>
            </Grid>
          </Box>

          <StaticDatePicker
            displayStaticWrapperAs="desktop"
            value={activeField === 'start' ? tempStartDate : tempEndDate}
            onChange={handleDateChange}
            shouldDisableDate={shouldDisableDate}
            minDate={minDate}
            maxDate={maxDate}
            showDaysOutsideCurrentMonth
            renderInput={((params) => (
              <TextField
                fullWidth
                size="small"
                {...params}
                sx={{
                  fieldset: {
                    display: 'none',
                  },
                  ...sx,
                }}
              />
            ))}
          />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button onClick={() => handleClear()} disabled={!startDate && !endDate}>
              {trans('clear')}
            </Button>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button onClick={handleClose}>
                {trans('cancel')}
              </Button>
              <Button
                variant="contained"
                onClick={handleApply}
                disabled={!isValidRange(tempStartDate, tempEndDate)}
              >
                {trans('apply')}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Popover>
    </LocalizationProvider>
  );
}

export { DateRangePicker };
