import './App.css';
import Layout from './components/layout/Layout';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Events from './pages/Events';
import Members from './pages/Members';
import Apply from './pages/Apply';

function App() {

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/members" element={<Members />} />
        <Route path="/apply" element={<Apply />} />
      </Routes>
    </Layout>
  );
}

export default App
