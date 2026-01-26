import type { AppProps } from 'next/app'
import '../styles/globals.css'
import '../styles/animations.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import SocketProvider from '../components/SocketProvider'
import Layout from '../components/Layout'
import { ThemeProvider } from '../components/ThemeProvider'
import { StuckDetectionProvider } from '../components/StuckDetectionProvider'
import { ApiErrorProvider } from '../components/ApiErrorProvider'

function MyApp({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <StuckDetectionProvider>
          <SocketProvider>
            <ApiErrorProvider>
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </ApiErrorProvider>
          </SocketProvider>
        </StuckDetectionProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default MyApp
