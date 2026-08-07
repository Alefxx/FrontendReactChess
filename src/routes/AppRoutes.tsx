import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { LoginView } from '@/features/auth/view/LoginView';
import { RegisterView } from '@/features/auth/view/RegisterView';
import { DashboardView } from '@/features/dashboard/view/DashBoardView';
import { BotView } from '@/features/botselection/view/BotView';
import { TimeView } from '@/features/timeselection/view/TimeView';
import { MatchView } from '@/features/match/view/MatchView'; 
import { ProfileView } from '@/features/profile/ProfileView'; 
import { GameModeView } from '@/features/gamemode/view/GameModeView';
import { LocalView } from '@/features/localmatch/view/LocalView';
import { GameLocal } from '@/features/match/view/GameLocalView';
import { MatchAnalysis } from '@/features/matchanalysis/view/MatchAnalysis';


const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },
  { path: '/analysis',
    element: <MatchAnalysis />,
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
    path: '/matchlocal', 
    element: <GameLocal />,
  },
    {
    path: '/localview', 
    element: <LocalView />,
  },
  {
    path: '/gamemode', 
    element: <GameModeView />,
  },
  {
    path: '/profile',
    element: <ProfileView />,
  }
]);

export function AppRoutes() {
  return <RouterProvider router={router} />;
}
