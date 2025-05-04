import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppRoutes } from './app-routes'
import WalletContext from '../context/walletContext'

const client = new QueryClient()

export function App() {
  return (
    <WalletContext>
      <QueryClientProvider client={client}>
        <AppRoutes />
      </QueryClientProvider>
    </WalletContext>
  )


}