import { AuthProvider } from './contexts/AuthContext';
import { Routes, Route } from 'react-router-dom';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';
import './App.css';
import Layout from './components/layout/Layout';
import Home from './pages/Home/Home';
import Events from './pages/Events/Events';
import EventDetails from './pages/Events/EventDetails';
import Members from './pages/Members/Members';
import Apply from './pages/Apply/Apply';
import CreateAccount from './pages/LogIn/CreateAccount';
import AccountInfo from './pages/AccountInfo/AccountInfo';
import AdminLayout from './pages/Admin/AdminLayout';

function App() {

  return (
    <AuthProvider>
      <Routes>
        <Route path="/create-account" element={<CreateAccount />} />
        
        <Route path="/*" element={
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/events" element={<Events />} />
              <Route path="/events/:eventId" element={<EventDetails />} />
              <Route path="/members" element={<Members />} />
              <Route path="/apply" element={<Apply />} />
              <Route path="/account" element={<AccountInfo />} />
              <Route 
                path="/admin" 
                element={
                  <ProtectedAdminRoute>
                    <AdminLayout />
                  </ProtectedAdminRoute>
                } 
              />
            </Routes>
          </Layout>
        } />
      </Routes>
    </AuthProvider>
  );
}

export default App
