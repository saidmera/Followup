
import React, { useState, useEffect } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import LocationList from './pages/LocationList';
import AddEditLocation from './pages/AddEditLocation';
import ImportLocations from './pages/ImportLocations';
import Statistics from './pages/Statistics';
import { User } from './types';

export enum Route {
  LOGIN = 'login',
  DASHBOARD = 'dashboard',
  LIST = 'list',
  ADD = 'add',
  EDIT = 'edit',
  IMPORT = 'import',
  SUMMARY = 'summary'
}

const App: React.FC = () => {
  const [user, setUser] = useState<User>({ username: '', isLoggedIn: false });
  const [currentRoute, setCurrentRoute] = useState<Route>(Route.LOGIN);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('session_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setCurrentRoute(Route.DASHBOARD);
    }
  }, []);

  const handleLogin = (username: string) => {
    const userData = { username, isLoggedIn: true };
    setUser(userData);
    localStorage.setItem('session_user', JSON.stringify(userData));
    setCurrentRoute(Route.DASHBOARD);
  };

  const handleLogout = () => {
    setUser({ username: '', isLoggedIn: false });
    localStorage.removeItem('session_user');
    setCurrentRoute(Route.LOGIN);
  };

  const navigateTo = (route: Route, id: string | null = null) => {
    setEditingId(id);
    setCurrentRoute(route);
  };

  const renderPage = () => {
    if (!user.isLoggedIn && currentRoute !== Route.LOGIN) {
      return <Login onLogin={handleLogin} />;
    }

    switch (currentRoute) {
      case Route.LOGIN:
        return <Login onLogin={handleLogin} />;
      case Route.DASHBOARD:
        return (
          <Dashboard 
            onNavigate={navigateTo} 
            onLogout={handleLogout} 
            userName={user.username} 
          />
        );
      case Route.LIST:
        return (
          <LocationList 
            onNavigate={navigateTo} 
            onBack={() => setCurrentRoute(Route.DASHBOARD)} 
          />
        );
      case Route.ADD:
        return (
          <AddEditLocation 
            onBack={() => setCurrentRoute(Route.DASHBOARD)} 
            onSuccess={() => setCurrentRoute(Route.LIST)} 
          />
        );
      case Route.EDIT:
        return (
          <AddEditLocation 
            id={editingId || undefined}
            onBack={() => setCurrentRoute(Route.LIST)} 
            onSuccess={() => setCurrentRoute(Route.LIST)} 
          />
        );
      case Route.IMPORT:
        return (
          <ImportLocations 
            onBack={() => setCurrentRoute(Route.DASHBOARD)} 
            onSuccess={() => setCurrentRoute(Route.LIST)} 
          />
        );
      case Route.SUMMARY:
        return (
          <Statistics 
            onBack={() => setCurrentRoute(Route.DASHBOARD)} 
            onNavigate={navigateTo}
          />
        );
      default:
        return <Login onLogin={handleLogin} />;
    }
  };

  return (
    <div className="min-h-screen max-w-md mx-auto bg-slate-50 shadow-xl overflow-hidden relative">
      {renderPage()}
    </div>
  );
};

export default App;
