import type { AppProps } from 'next/app'
import { Analytics } from '@vercel/analytics/react';
import { ChakraProvider } from '@chakra-ui/react'

function MyApp({ Component, pageProps }: AppProps) {
  return <ChakraProvider>
  <Component {...pageProps} />
    <Analytics />
  </ChakraProvider>
}

export default MyApp
