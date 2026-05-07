import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => (
  <header style={{ 
    padding: '1rem 2rem', 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    background: '#ffffff',
    borderBottom: '1px solid var(--surface-border)',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <div style={{ 
        width: '32px', height: '32px', 
        background: 'var(--primary)', 
        borderRadius: '8px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'white', fontWeight: 'bold', fontSize: '1.2rem'
      }}>S</div>
      <h1 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-primary)', fontWeight: 700 }}>
        SmartForm <span style={{ color: 'var(--primary)', fontWeight: 400 }}>Platform</span>
      </h1>
    </div>
  </header>
);

const Footer = () => (
  <footer style={{ 
    padding: '2rem', 
    textAlign: 'center', 
    color: 'var(--text-secondary)', 
    fontSize: '0.85rem',
    borderTop: '1px solid var(--surface-border)',
    background: '#ffffff',
    marginTop: 'auto'
  }}>
    &copy; 2026 SmartForm Platform. Designed for Enterprise.
  </footer>
);

const Navigation = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{ 
      display: 'flex', 
      gap: '20px', 
      justifyContent: 'center', 
      padding: '0.8rem',
      background: '#ffffff',
      borderBottom: '1px solid var(--surface-border)'
    }}>
      <Link to="/" style={{ 
        fontWeight: '500', 
        padding: '6px 16px', 
        borderRadius: '20px',
        background: isActive('/') ? 'rgba(0, 177, 79, 0.1)' : 'transparent',
        color: isActive('/') ? 'var(--primary)' : 'var(--text-secondary)'
      }}>Workspace (Điền Form)</Link>
      
      <Link to="/admin" style={{ 
        fontWeight: '500', 
        padding: '6px 16px', 
        borderRadius: '20px',
        background: isActive('/admin') ? 'rgba(0, 177, 79, 0.1)' : 'transparent',
        color: isActive('/admin') ? 'var(--primary)' : 'var(--text-secondary)'
      }}>Admin Dashboard</Link>
    </nav>
  );
};

const MainLayout = ({ children }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-color)' }}>
      <Header />
      <Navigation />
      <main style={{ padding: '2rem 1rem', flex: 1, maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
        <div className="animate-fade-in">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
