import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { formApi } from '../services';
import { parseOptions } from '../utils';

const FormViewContainer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchForm();
  }, [id]);

  const fetchForm = async () => {
    try {
      const response = await formApi.getFormById(id);
      setForm(response.data.data);
    } catch (error) {
      console.error(error);
      alert('Form not found');
    }
  };

  const handleAnswerChange = (fieldId, value) => {
    setAnswers(prev => ({ ...prev, [fieldId]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    let extractedName = 'Khách (Ẩn danh)';
    for (const field of form.fields) {
      const lowerLabel = field.label.toLowerCase();
      if (lowerLabel.includes('tên') || lowerLabel.includes('name')) {
        if (answers[field.id]) {
          extractedName = answers[field.id];
          break;
        }
      }
    }

    const payload = {
      submitterName: extractedName,
      values: Object.entries(answers).map(([formFieldId, value]) => ({ formFieldId, value }))
    };

    try {
      await formApi.submitForm(id, payload);
      alert('Form submitted successfully! 🎉');
      navigate('/');
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Failed to submit form');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!form) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem' }}>
      <div className="animate-spin" style={{ fontSize: '2rem', marginBottom: '1rem' }}>✨</div>
      <p style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Loading beautiful form...</p>
    </div>
  );

  return (
    <div className="animate-fade-in" style={{ maxWidth: '700px', margin: '0 auto' }}>
      <div className="glass-card" style={{ padding: '3rem 2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div style={{ width: '64px', height: '64px', background: 'var(--primary-glow)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 1.5rem auto' }}>
            📝
          </div>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '0.75rem', marginTop: 0, fontWeight: 800 }}>{form.title}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.5 }}>{form.description}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gap: '2rem' }}>
            {form.fields?.sort((a, b) => a.order - b.order).map(field => (
              <div key={field.id} className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>
                  {field.label} {field.required && <span style={{color: 'var(--danger)'}}>*</span>}
                </label>
                
                {field.type === 'text' && (
                  <input 
                    className="form-input"
                    required={field.required}
                    type="text" 
                    maxLength="200"
                    placeholder="Type your answer here..."
                    onChange={(e) => handleAnswerChange(field.id, e.target.value)}
                  />
                )}

                {field.type === 'number' && (
                  <input 
                    className="form-input"
                    required={field.required}
                    type="number" 
                    min="0"
                    max="100"
                    placeholder="Enter a number (0-100)"
                    onChange={(e) => handleAnswerChange(field.id, e.target.value)}
                  />
                )}

                {field.type === 'date' && (
                  <input 
                    className="form-input"
                    required={field.required}
                    type="date" 
                    onChange={(e) => handleAnswerChange(field.id, e.target.value)}
                  />
                )}

                {field.type === 'color' && (
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <input 
                      className="form-input"
                      required={field.required}
                      type="color" 
                      style={{ width: '60px', height: '48px', padding: '4px', cursor: 'pointer' }}
                      onChange={(e) => handleAnswerChange(field.id, e.target.value)}
                    />
                    <span style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>Pick a color</span>
                  </div>
                )}

                {field.type === 'select' && (
                  <select 
                    className="form-select"
                    required={field.required}
                    defaultValue=""
                    onChange={(e) => handleAnswerChange(field.id, e.target.value)}
                  >
                    <option value="" disabled>Select an option</option>
                    {parseOptions(field.options).map((opt, idx) => (
                      <option key={idx} value={opt}>{opt}</option>
                    ))}
                  </select>
                )}
              </div>
            ))}
          </div>

          <div style={{ marginTop: '4rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <button 
              type="submit" 
              className="btn-primary" 
              disabled={isSubmitting}
              style={{ width: '100%', padding: '16px', fontSize: '1.1rem' }}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Responses'}
            </button>
            <button 
              type="button" 
              className="btn-secondary" 
              onClick={() => navigate('/')}
              style={{ width: '100%', border: 'none', background: 'transparent' }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
      
      <div style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>
        Powered by SmartForm Platform &bull; Secure and Encrypted
      </div>
    </div>
  );
};

export default FormViewContainer;
