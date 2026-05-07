import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => (
  <header style={{ 
    padding: '1rem 2rem', 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    background: 'var(--surface)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid var(--surface-border)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
  }}>
    <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'inherit' }}>
      <div style={{ 
        width: '38px', height: '38px', 
        background: 'linear-gradient(135deg, var(--primary), var(--accent))', 
        borderRadius: '10px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'white', fontWeight: '800', fontSize: '1.4rem',
        boxShadow: '0 4px 12px var(--primary-glow)'
      }}>S</div>
      <h1 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--text-primary)', fontWeight: 800, letterSpacing: '-0.02em' }}>
        SmartForm <span style={{ color: 'var(--primary)', fontWeight: 500 }}>Platform</span>
      </h1>
    </Link>
    
    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
      {/* Add more header items if needed, like user profile or theme toggle */}
    </div>
  </header>
);

export default Header;
