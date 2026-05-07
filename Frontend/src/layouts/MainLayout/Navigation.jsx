import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const linkStyle = (path) => ({
    fontWeight: '500',
    padding: '6px 16px',
    borderRadius: '20px',
    background: isActive(path) ? 'rgba(0, 177, 79, 0.1)' : 'transparent',
    color: isActive(path) ? 'var(--primary)' : 'var(--text-secondary)',
  });

  return (
    <nav style={{ 
      display: 'flex', 
      gap: '20px', 
      justifyContent: 'center', 
      padding: '0.8rem',
      background: '#ffffff',
      borderBottom: '1px solid var(--surface-border)'
    }}>
      <Link to="/" style={linkStyle('/')}>Workspace (Điền Form)</Link>
      <Link to="/admin" style={linkStyle('/admin')}>Admin Dashboard</Link>
    </nav>
  );
};

export default Navigation;
