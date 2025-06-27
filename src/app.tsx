import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RootLayout } from './app/layout'
import { AppRouter } from './app/root'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RootLayout>
        <AppRouter />
      </RootLayout>
    </QueryClientProvider>
  )
}

export default App
