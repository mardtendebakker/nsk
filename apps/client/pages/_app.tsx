import { AppProps } from 'next/app';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { setConfig } from 'itranslator';
import { SnackbarProvider } from 'notistack';
import ThemeProvider from '../theme';
import './index.css';
import TopLinearProgress from '../components/topLinearProgress';
import { getDefaultLocale } from '../utils/storage';
import { localeMapping } from '../hooks/useTranslation';

setConfig({ source: localeMapping[getDefaultLocale()] });

function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <SnackbarProvider>
        <Head>
          <link href="https://fonts.cdnfonts.com/css/inter" rel="stylesheet" />
          <title>NSK</title>
        </Head>
        <TopLinearProgress />
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <Component {...pageProps} />
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default dynamic(() => Promise.resolve(App), {
  ssr: false,
});
