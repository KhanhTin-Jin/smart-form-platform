import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { formApi } from '../services';
import { parseOptions } from '../utils';

const FormViewContainer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [answers, setAnswers] = useState({});

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
    
    // Tự động tìm field có chữ "tên" hoặc "name" để làm SubmitterName
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
    }
  };

  if (!form) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading beautiful form... ✨</div>;

  return (
    <div className="glass-card">
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '2.2rem', marginBottom: '0.5rem', marginTop: 0 }}>{form.title}</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>{form.description}</p>
      </div>

      <form onSubmit={handleSubmit}>

        {form.fields?.sort((a, b) => a.order - b.order).map(field => (
          <div key={field.id} className="form-group">
            <label className="form-label">
              {field.label} {field.required && <span style={{color: '#d93025'}}>*</span>}
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
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => handleAnswerChange(field.id, e.target.value)}
              />
            )}

            {field.type === 'color' && (
              <input 
                className="form-input"
                required={field.required}
                type="color" 
                style={{height: '50px', padding: '5px'}}
                onChange={(e) => handleAnswerChange(field.id, e.target.value)}
              />
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

        <div style={{ marginTop: '3rem', textAlign: 'center' }}>
          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '15px' }}>
            Submit Responses
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormViewContainer;
