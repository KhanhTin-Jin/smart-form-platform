import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const getLinkStyle = (path) => ({
    fontWeight: '600',
    padding: '8px 24px',
    borderRadius: 'var(--radius-full)',
    background: isActive(path) ? 'var(--primary)' : 'transparent',
    color: isActive(path) ? 'white' : 'var(--text-secondary)',
    transition: 'var(--transition)',
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    boxShadow: isActive(path) ? '0 4px 12px var(--primary-glow)' : 'none',
  });

  return (
    <nav style={{ 
      display: 'flex', 
      gap: '8px', 
      justifyContent: 'center', 
      padding: '1.2rem 1rem',
      background: 'transparent',
    }}>
      <div style={{
        display: 'flex',
        gap: '4px',
        padding: '4px',
        background: 'rgba(255, 255, 255, 0.5)',
        backdropFilter: 'blur(8px)',
        borderRadius: 'var(--radius-full)',
        border: '1px solid var(--surface-border)',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
      }}>
        <Link to="/" style={getLinkStyle('/')}>
          <span style={{ fontSize: '1.1rem' }}>📋</span> Workspace
        </Link>
        <Link to="/admin" style={getLinkStyle('/admin')}>
          <span style={{ fontSize: '1.1rem' }}>⚙️</span> Admin Panel
        </Link>
      </div>
    </nav>
  );
};

export default Navigation;
