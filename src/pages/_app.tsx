import type { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <style global jsx>{`
        html,
        body,
        body > div:first-child,
        div#__next,
        div#__next > div {
          height: 100%;
        }
      `}</style>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}
