import { AppProps } from 'next/app';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { setConfig } from 'itranslator';
import { SnackbarProvider } from 'notistack';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import ThemeProvider from '../theme';
import './index.css';
import TopLinearProgress from '../components/topLinearProgress';
import { getDefaultLocale } from '../utils/storage';
import { localeMapping } from '../hooks/useTranslation';

setConfig({ source: localeMapping[getDefaultLocale()] });

function App({ Component, pageProps }: AppProps) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <ThemeProvider>
        <Head>
          <link href="https://fonts.cdnfonts.com/css/inter" rel="stylesheet" />
          <title>NSK</title>
        </Head>
        <TopLinearProgress />
        <SnackbarProvider>
          <Component {...pageProps} />
        </SnackbarProvider>
      </ThemeProvider>
    </LocalizationProvider>
  );
}

export default dynamic(() => Promise.resolve(App), {
  ssr: false,
});
