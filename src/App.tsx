import { MainLayout } from '@/components/layout/MainLayout';
import { AppRoutes } from '@/routes/AppRoutes';

function App() {
  return (
    <MainLayout>
      {/* Removemos o Header com Logo daqui. Agora as telas decidem como mostrar o Logo! */}
      <AppRoutes />
    </MainLayout>
  );
}

export default App;
