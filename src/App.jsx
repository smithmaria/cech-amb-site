import { AuthProvider } from './contexts/AuthContext';
import './App.css';
import Layout from './components/layout/Layout';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Events from './pages/Events/Events';
import EventDetails from './pages/Events/EventDetails';
import Members from './pages/Members/Members';
import Apply from './pages/Apply/Apply';
import CreateAccount from './pages/LogIn/CreateAccount';
import AccountInfo from './pages/AccountInfo/AccountInfo';

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
            </Routes>
          </Layout>
        } />
      </Routes>
    </AuthProvider>
  );
}

export default App
