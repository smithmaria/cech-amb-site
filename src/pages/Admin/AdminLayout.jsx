import { useState } from "react";
import ManageUsers from "./Users/ManageUsers";
import ManageEvents from "./ManageEvents";
import './Admin.css';

const AdminLayout = () => {
  const [activeTab, setActiveTab] = useState('users');
  
  const tabs = [
    { id: 'users', label: 'Users', component: ManageUsers },
    { id: 'events', label: 'Events', component: ManageEvents },
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
    <div className="page">
      <div className="admin-header">
        <h1>Admin Settings</h1>
        <nav className="tab-nav">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`tab-button ${activeTab === tab.id ? 'tab-active' : ''}`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      <ActiveComponent />
    </div>
  );
};

export default AdminLayout;
