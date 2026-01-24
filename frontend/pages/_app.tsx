import type { AppProps } from 'next/app'
import '../styles/globals.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import SocketProvider from '../components/SocketProvider'
import Layout from '../components/Layout'
import { ThemeProvider } from '../components/ThemeProvider'
import { StuckDetectionProvider } from '../components/StuckDetectionProvider'

function MyApp({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <StuckDetectionProvider>
          <SocketProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </SocketProvider>
        </StuckDetectionProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default MyApp
