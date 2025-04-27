import {
  Box, Button, Card, CardContent, Theme as MaterialTheme, Typography,
} from '@mui/material';
import CloudDownload from '@mui/icons-material/CloudDownload';
import Action from './action';
import ColorPicker from './colorPicker';
import TextField from '../../memoizedInput/textField';
import useTranslation, { Trans } from '../../../hooks/useTranslation';
import ImageInput from '../../input/imageInput';
import useResponsive from '../../../hooks/useResponsive';
import useForm, { FormRepresentation } from '../../../hooks/useForm';
import useAxios from '../../../hooks/useAxios';
import { ADMIN_THEME_PATH } from '../../../utils/axios';
import { Theme as ThemeModel } from '../../../utils/axios/models/theme';
import useTheme from '../../../hooks/useTheme';

const PALETTE_PREFIX = 'palette:';
const createPaletteElementKey = (label: string): string => `${PALETTE_PREFIX}${label}`;

function initFormState(theme: ThemeModel, trans: Trans) {
  const state = {
    companyName: { value: theme.companyName, required: true },
    dashboardMessage: { value: theme.dashboardMessage },
    logo: {
      value: theme.logo,
      required: true,
      validator: (formRepresentation:FormRepresentation): undefined | string => {
        if (formRepresentation.logo?.value?.size > 80000) {
          return trans('themeForm.logo.caption');
        }
      },
    },
    favicon: {
      value: theme.favicon,
      required: true,
      validator: (formRepresentation:FormRepresentation): undefined | string => {
        if (formRepresentation.favicon?.value?.size > 4000) {
          return trans('themeForm.favicon.caption');
        }
      },
    },
  };

  Object.keys(theme.palette).forEach((paletteElementKey) => {
    state[createPaletteElementKey(paletteElementKey)] = { value: theme.palette[paletteElementKey] };
  });

  return state;
}

export default function Theme() {
  const { trans } = useTranslation();
  const isDesktop = useResponsive('up', 'sm');
  const { call, performing } = useAxios('put', ADMIN_THEME_PATH, { showSuccessMessage: true, withProgressBar: true });
  const { state: { theme: myTheme, loading }, fetchTheme, resetPalette } = useTheme();

  const {
    formRepresentation, setValue, validate,
  } = useForm(initFormState(myTheme, trans));

  const canSubmit = () => !performing && !loading;

  const prepareBody = (): FormData => {
    const formData = new FormData();

    const palette = {};

    formData.append('companyName', formRepresentation.companyName.value);
    formData.append('dashboardMessage', formRepresentation.dashboardMessage.value);

    Object.keys(formRepresentation).forEach((key) => {
      if (key.includes(PALETTE_PREFIX)) {
        palette[key.split(PALETTE_PREFIX)[1]] = formRepresentation[key].value;
      }
    });

    formData.append('palette', JSON.stringify(palette));

    if (formRepresentation.logo.value instanceof File) {
      formData.append('logo', formRepresentation.logo.value);
    }

    if (formRepresentation.favicon.value instanceof File) {
      formData.append('favicon', formRepresentation.favicon.value);
    }

    return formData;
  };

  const handleSubmit = () => {
    if (validate() || !canSubmit()) {
      return;
    }

    call({ body: prepareBody(), headers: { 'Content-Type': 'multipart/form-data' } }).then(() => {
      fetchTheme();
    });
  };

  const imagePlaceholder = (hovered:boolean, type: 'logo' | 'favicon') => (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <CloudDownload
        sx={{
          bgcolor: (theme) => theme.palette.primary.light,
          p: '.7rem',
          fontSize: '2.5rem',
          borderRadius: '2rem',
          zIndex: -1,
        }}
      />
      <Typography variant="h4" sx={{ mb: '.5rem', maxWidth: '13rem' }}>{trans(`themeForm.${type}.placeholder`)}</Typography>
      <Typography variant="caption" sx={{ mb: '.5rem', maxWidth: '13rem' }}>{trans(`themeForm.${type}.caption`)}</Typography>
      <Button variant="contained" sx={{ zIndex: -1 }}>{trans('upload')}</Button>
    </Box>
  );

  const handleColorChange = (value: { [key: string]: string }, label: string) => {
    setValue({
      field: createPaletteElementKey(label),
      value,
    });
  };

  return (
    <Card sx={{ maxWidth: '80rem' }}>
      <CardContent>
        <Action
          disabled={!canSubmit()}
          onReset={resetPalette}
          onSave={handleSubmit}
        />
        <Box sx={{
          display: 'flex',
          flexDirection: isDesktop ? 'unset' : 'column',
          margin: 'auto',
        }}
        >
          <Box sx={{ flex: 0.49 }}>
            <TextField
              disabled={!canSubmit()}
              fullWidth
              sx={{ mb: '.5rem' }}
              label={trans('dashboardMessage')}
              value={formRepresentation.dashboardMessage.value || ''}
              helperText={formRepresentation.dashboardMessage.error}
              error={!!formRepresentation.dashboardMessage.error}
              placeholder={trans('dashboardMessage')}
              onChange={(e) => setValue({ field: 'dashboardMessage', value: e.target.value })}
            />
            <TextField
              disabled={!canSubmit()}
              fullWidth
              sx={{ mb: '.5rem' }}
              label={trans('companyName')}
              value={formRepresentation.companyName.value || ''}
              helperText={formRepresentation.companyName.error}
              error={!!formRepresentation.companyName.error}
              placeholder={trans('companyName')}
              onChange={(e) => setValue({ field: 'companyName', value: e.target.value })}
            />
            {
            Object
              .keys(myTheme.palette || {})
              .map((label) => (
                <ColorPicker
                  disabled={!canSubmit()}
                  key={label}
                  palette={formRepresentation[createPaletteElementKey(label)].value}
                  label={label}
                  sx={{ mb: '.5rem' }}
                  onChange={(value) => handleColorChange(value, label)}
                />
              ))
            }
          </Box>
          <Box sx={{ flex: 0.02 }} />
          <Box sx={{
            flex: 0.49,
            display: 'flex',
            flexDirection: isDesktop ? 'unset' : 'column',
          }}
          >
            <Box sx={{ flex: 0.49 }}>
              <ImageInput
                disabled={!canSubmit()}
                errorMessage={formRepresentation.logo.error}
                placeholder={(hovered) => imagePlaceholder(hovered, 'logo')}
                image={formRepresentation.logo.value}
                onChange={(file: File) => setValue({ field: 'logo', value: file })}
                onClear={() => setValue({ field: 'logo', value: null })}
                sx={{ border: (theme: MaterialTheme) => `1px dashed ${theme.palette.divider}`, mt: '1.5rem' }}
              />
            </Box>
            <Box sx={{ flex: 0.02 }} />
            <Box sx={{ flex: 0.49 }}>
              <ImageInput
                disabled={!canSubmit()}
                errorMessage={formRepresentation.favicon.error}
                placeholder={(hovered) => imagePlaceholder(hovered, 'favicon')}
                image={formRepresentation.favicon.value}
                onChange={(file: File) => setValue({ field: 'favicon', value: file })}
                onClear={() => setValue({ field: 'favicon', value: null })}
                sx={{ border: (theme: MaterialTheme) => `1px dashed ${theme.palette.divider}`, mt: '1.5rem' }}
                accept=".ico,.svg"
              />
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
