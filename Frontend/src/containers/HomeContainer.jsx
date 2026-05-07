import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { formApi } from '../services/ApiService';

const HomeContainer = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      // Dùng GetActiveForms theo đúng business logic: Submitter chỉ thấy form 'active'
      const response = await formApi.getActiveForms();
      setForms(response.data.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ textAlign: 'center' }}>Loading forms... ✨</div>;

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '2.5rem', margin: '0 0 1rem 0' }}>Explore Forms</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Discover and fill out available forms below.</p>
      </div>

      {forms.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 1rem 0' }}>No forms available</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>It looks like there are no active forms right now.</p>
          <Link to="/admin" className="btn-primary">Go to Admin Dashboard</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '20px' }}>
          {forms.sort((a, b) => a.order - b.order).map(form => (
            <div key={form.id} className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '2rem' }}>
              <div>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.4rem' }}>{form.title}</h3>
                <p style={{ margin: 0, color: 'var(--text-secondary)' }}>{form.description}</p>
              </div>
              <div>
                <Link to={`/form/${form.id}`} className="btn-primary" style={{ whiteSpace: 'nowrap' }}>
                  Open Form &rarr;
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
