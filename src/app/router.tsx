import { createBrowserRouter } from 'react-router-dom'
import LumiPage from '@/pages/Lumi'
import LumiTest from '@/pages/LumiTest'

// Main routes will be added here
const router = createBrowserRouter([
  {
    path: '/',
    element: <div>Welcome to Toivo</div>,
  },
  {
    path: '/lumi',
    element: <LumiPage />,
  },
  {
    path: '/lumi-test',
    element: <LumiTest />,
  },
])

export { router }
