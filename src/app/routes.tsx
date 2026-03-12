import { createBrowserRouter } from 'react-router';
import { PrivateRoute } from './components/PrivateRoute';
import { UploadPage } from './pages/UploadPage';
import { MetadataPage } from './pages/MetadataPage';
import { BatchAnalysisPage } from './pages/BatchAnalysisPage';
import { HistoryPage } from './pages/HistoryPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { ProfilePage } from './pages/ProfilePage';

export const router = createBrowserRouter([
  // ── Public routes
  { path: '/login',  Component: LoginPage },
  { path: '/signup', Component: SignupPage },

  // ── Protected routes
  {
    path: '/',
    element: <PrivateRoute><UploadPage /></PrivateRoute>,
  },
  {
    path: '/metadata/:fileId',
    element: <PrivateRoute><MetadataPage /></PrivateRoute>,
  },
  {
    path: '/batch',
    element: <PrivateRoute><BatchAnalysisPage /></PrivateRoute>,
  },
  {
    path: '/history',
    element: <PrivateRoute><HistoryPage /></PrivateRoute>,
  },
  {
    path: '/profile',
    element: <PrivateRoute><ProfilePage /></PrivateRoute>,
  },
]);
