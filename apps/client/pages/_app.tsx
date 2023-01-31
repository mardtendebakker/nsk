import { AppProps } from 'next/app';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { setConfig } from 'itranslator';
import { SnackbarProvider } from 'notistack';
import ThemeProvider from '../theme';
import source from '../public/translations/nl';
import './index.css';
import TopLinearProgress from '../components/topLinearProgress';

setConfig({ source });

function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <Head>
        <title>NSK</title>
      </Head>
      <TopLinearProgress />
      <SnackbarProvider>
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <Component {...pageProps} />
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default dynamic(() => Promise.resolve(App), {
  ssr: false,
});
