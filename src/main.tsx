import '@csstools/normalize.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ConfigProvider } from 'antd'
import ruRu from 'antd/locale/ru_RU'
import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import AuthProvider from './components/AuthProvider'
import App from './components/App'
import './index.scss'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ConfigProvider
        locale={ruRu}
        theme={{
          token: {
            fontFamily:
              "Roboto, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
          },
        }}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ConfigProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  </StrictMode>
)
