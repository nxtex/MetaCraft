import { createBrowserRouter } from 'react-router';
import { PrivateRoute } from './components/PrivateRoute';
import { LandingPage }    from './pages/LandingPage';
import { LoginPage }      from './pages/LoginPage';
import { SignupPage }     from './pages/SignupPage';
import { AppPage }        from './pages/AppPage';
import { HistoryPage }    from './pages/HistoryPage';
import { ProfilePage }    from './pages/ProfilePage';

export const router = createBrowserRouter([
  // ── Public
  { path: '/',        Component: LandingPage },
  { path: '/login',   Component: LoginPage },
  { path: '/signup',  Component: SignupPage },

  // ── Protected
  { path: '/app',     element: <PrivateRoute><AppPage /></PrivateRoute> },
  { path: '/history', element: <PrivateRoute><HistoryPage /></PrivateRoute> },
  { path: '/profile', element: <PrivateRoute><ProfilePage /></PrivateRoute> },
]);
