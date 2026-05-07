import React from 'react';
import Header from './Header';
import Navigation from './Navigation';
import Footer from './Footer';

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
