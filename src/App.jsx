import { Route, Routes } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import { RequireSuperAdmin } from './auth/RequireSuperAdmin';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminMarketsPage } from './pages/AdminMarketsPage';
import { AdminMarketDetailPage } from './pages/AdminMarketDetailPage';
import './styles/theme.css';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<AdminLoginPage />} />
        <Route element={<RequireSuperAdmin />}>
          <Route path="/" element={<AdminMarketsPage />} />
          <Route path="/markets/:id" element={<AdminMarketDetailPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
