import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { formApi } from '../services';

const HomeContainer = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      const response = await formApi.getActiveForms();
      setForms(response.data.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem' }}>
      <div className="animate-spin" style={{ fontSize: '2rem', marginBottom: '1rem' }}>✨</div>
      <p style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Loading beautiful forms...</p>
    </div>
  );

  return (
    <div className="animate-fade-in">
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h2 style={{ fontSize: '3rem', margin: '0 0 1rem 0', background: 'linear-gradient(to right, var(--text-primary), var(--primary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Explore Forms
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
          Discover and fill out available forms with our seamless, intuitive platform designed for speed and clarity.
        </p>
      </div>

      {forms.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>📭</div>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.5rem' }}>No forms available right now</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem', maxWidth: '400px', margin: '0 auto 2.5rem auto' }}>
            It looks like there are no active forms at the moment. Please check back later or visit the admin dashboard.
          </p>
          <Link to="/admin" className="btn-secondary">
            Go to Admin Dashboard
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
          {forms.sort((a, b) => a.order - b.order).map(form => (
            <div key={form.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ width: '48px', height: '48px', background: 'var(--primary-glow)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginBottom: '1rem' }}>
                  📄
                </div>
                <h3 style={{ margin: '0 0 0.75rem 0', fontSize: '1.4rem', lineHeight: 1.2 }}>{form.title}</h3>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{form.description}</p>
              </div>
              <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'flex-end' }}>
                <Link to={`/form/${form.id}`} className="btn-primary" style={{ width: '100%' }}>
                  Open Form <span>&rarr;</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomeContainer;
