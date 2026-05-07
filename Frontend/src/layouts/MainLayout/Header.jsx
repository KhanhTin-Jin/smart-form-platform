import React from 'react';

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

export default Header;
