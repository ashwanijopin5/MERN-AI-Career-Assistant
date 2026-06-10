
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Register from './pages/Register'
import Login from './pages/login'

import Dashboard from './pages/Dashboard'
import ResumePage from './pages/ResumePage'
import AnalysisPage from './pages/AnalysisPage'
import AnalysisDetailsPage from './pages/AnalysisDetailsPage'
import InterviewPrepPage from './pages/InterviewPrepPage'
import JobPage from './pages/JobPage'
import InterviewHistoryPage from './pages/InterviewHistoryPage'
import JobDetailsPage from './pages/JobDetailsPage'
import ProfilePage from './pages/ProfilePage'
import AppInitializer from './components/AppInitializer'
import ProtectedRoute from './components/shared/ProtectedRoute'
import MLAnalysisPage from './pages/MLAnalysisPage'
const appRouter = createBrowserRouter([


  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    )
  },
  {
    path: "/interview",
    element: (<ProtectedRoute>
      <InterviewHistoryPage />
    </ProtectedRoute>)
  },
  {
    path: "/ml-analysis/:id",
    element: (<ProtectedRoute>
      <MLAnalysisPage />
    </ProtectedRoute>)
  },
  {
    path: "/jobs",
    element: (<ProtectedRoute>
      <JobPage />
    </ProtectedRoute>)
  },
  {
    path: "/interview/:analysisId",
    element: (
      <ProtectedRoute>
        <InterviewPrepPage />
      </ProtectedRoute>
    )
  },
  {
    path: "/analysis/:id",
    element: (
      <ProtectedRoute>
        <AnalysisDetailsPage />
      </ProtectedRoute>
    )
  },
  {
    path: "/jobs/:id",
    element: (
      <ProtectedRoute>
        <JobDetailsPage />
      </ProtectedRoute>
    )
  },
  {
    path: "/analysis",
    element: (<ProtectedRoute>
      <AnalysisPage />
    </ProtectedRoute>)
  },
  {
    path: "/resume",
    element: (<ProtectedRoute>
      <ResumePage />
    </ProtectedRoute>)
  },
  {
    path: "/register",
    element: <Register />
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/profile",
    element: (<ProtectedRoute>
      <ProfilePage />
    </ProtectedRoute>)
  }
])
function App() {



  return (
    <>
      <AppInitializer />
      <RouterProvider router={appRouter} />
    </>
  )
}

export default App
