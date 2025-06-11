import './App.css';
import Layout from './components/layout/Layout';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Events from './pages/Events/Events';
import Members from './pages/Members/Members';
import Apply from './pages/Apply/Apply';

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
