import { BrowserRouter } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '@/features/auth/AuthContext'
import { ToastProvider } from '@/components/ui/Toast'
import { CartProvider } from '@/lib/cart'
import { AppRoutes } from '@/routes'
import { ErrorBoundary } from '@/components/errors/ErrorBoundary'
import { createQueryClient } from '@/lib/query-client'

const queryClient = createQueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary variant="site">
        <CartProvider>
          <BrowserRouter>
            <ToastProvider>
              <AuthProvider>
                <AppRoutes />
              </AuthProvider>
            </ToastProvider>
          </BrowserRouter>
        </CartProvider>
      </ErrorBoundary>
    </QueryClientProvider>
  )
}

export default App
