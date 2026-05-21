import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { LoginView } from '@/features/auth/view/LoginView';
import { RegisterView } from '@/features/auth/view/RegisterView';
import { DashboardView } from '@/features/dashboard/view/DashBoardView';
import { BotView } from '@/features/botselection/view/BotView';
import { TimeView } from '@/features/timeselection/view/TimeView';
import { MatchView } from '@/features/match/view/MatchView'; 
import { ProfileView } from '@/features/profile/ProfileView'; 


const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },
  {
    path: '/login',
    element: <LoginView />,
  },
  {
    path: '/register',
    element: <RegisterView />,
  },
  {
    path: '/dashboard',
    element: <DashboardView />,
  },
  {
    path: '/bots',
    element: <BotView />,
  },
  {
    path: '/time',
    element: <TimeView />,
  },
  {
    path: '/match', 
    element: <MatchView />,
  },
  {
    path: '/profile',
    element: <ProfileView />,
  }
]);

export function AppRoutes() {
  return <RouterProvider router={router} />;
}
