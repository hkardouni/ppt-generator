import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Workspace from './workspace/index.tsx'
import { ClerkProvider } from '@clerk/clerk-react'
import { UserDetailContext } from '../context/UserDetailContext.tsx'
import Outline from './workspace/project/outline/index.tsx'

const router = createBrowserRouter([
  { path: '/', element: <App /> },
  {
    path: '/workspace', element: <Workspace />,
    children: [
      { path: 'project/:projectId/outline', element: <Outline /> }
    ]
  }
])
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}

// eslint-disable-next-line react-refresh/only-export-components
function Root() {
  const [userDetail, setUserDetail] = useState()
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
        <RouterProvider router={router} />
      </UserDetailContext.Provider>
    </ClerkProvider>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
