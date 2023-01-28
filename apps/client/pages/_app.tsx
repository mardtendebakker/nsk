import { AppProps } from 'next/app';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { setConfig } from 'itranslator';
import ThemeProvider from '../theme';
import source from '../public/translations/nl';
import './index.css';

setConfig({ source });

function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <Head>
        <title>NSK</title>
      </Head>
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default dynamic(() => Promise.resolve(App), {
  ssr: false,
});
