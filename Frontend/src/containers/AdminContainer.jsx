import React, { useEffect, useState } from 'react';
import { formApi, submissionApi } from '../services/ApiService';

const AdminContainer = () => {
  const [activeTab, setActiveTab] = useState('forms');
  const [forms, setForms] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  
  // Create Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [formOrder, setFormOrder] = useState(1);
  const [formStatus, setFormStatus] = useState('active');

  // Add Field State
  const [selectedFormId, setSelectedFormId] = useState(null);
  const [fieldLabel, setFieldLabel] = useState('');
  const [fieldType, setFieldType] = useState('text');
  const [fieldOptions, setFieldOptions] = useState('');
  const [fieldOrder, setFieldOrder] = useState(1);
  const [fieldRequired, setFieldRequired] = useState(true);

  // Edit Form State
  const [editingFormId, setEditingFormId] = useState(null);
  const [editFormTitle, setEditFormTitle] = useState('');
  const [editFormDesc, setEditFormDesc] = useState('');
  const [editFormStatus, setEditFormStatus] = useState('active');
  const [editFormOrder, setEditFormOrder] = useState(1);

  // Edit Field State
  const [editingFieldId, setEditingFieldId] = useState(null);
  const [editFieldLabel, setEditFieldLabel] = useState('');
  const [editFieldType, setEditFieldType] = useState('text');
  const [editFieldOptions, setEditFieldOptions] = useState('');
  const [editFieldOrder, setEditFieldOrder] = useState(1);
  const [editFieldRequired, setEditFieldRequired] = useState(true);

  useEffect(() => {
    fetchForms();
    fetchSubmissions();
  }, []);

  const fetchForms = async () => {
    try {
      const res = await formApi.getAllForms();
      setForms(res.data.data || []);
    } catch (e) { console.error(e); }
  };

  const fetchSubmissions = async () => {
    try {
      const res = await submissionApi.getAllSubmissions();
      setSubmissions(res.data.data || []);
    } catch (e) { console.error(e); }
  };

  // --- FORM CRUD ---
  const handleCreateForm = async (e) => {
    e.preventDefault();
    try {
      await formApi.createForm({ title, description, order: formOrder, status: formStatus });
      setTitle(''); setDescription(''); setFormOrder(1); setFormStatus('active');
      fetchForms();
    } catch (error) { alert('Error creating form'); }
  };

  const handleUpdateForm = async (e, formId) => {
    e.preventDefault();
    try {
      await formApi.updateForm(formId, { title: editFormTitle, description: editFormDesc, status: editFormStatus, order: editFormOrder });
      setEditingFormId(null);
      fetchForms();
    } catch (e) { alert('Error updating form'); }
  };

  const handleDeleteForm = async (id) => {
    if (!window.confirm('Are you sure you want to delete this form?')) return;
    try {
      await formApi.deleteForm(id);
      fetchForms();
    } catch (e) { alert('Error deleting form'); }
  };

  // --- FIELD CRUD ---
  const handleAddField = async (e, formId) => {
    e.preventDefault();
    try {
      let optionsStr = fieldType === 'select' ? fieldOptions : null;
      await formApi.addField(formId, { label: fieldLabel, type: fieldType, order: fieldOrder, required: fieldRequired, options: optionsStr });
      setFieldLabel(''); setFieldType('text'); setFieldOptions(''); setFieldOrder(1); setFieldRequired(true); setSelectedFormId(null);
      fetchForms();
    } catch (error) { alert('Error adding field'); }
  };

  const handleUpdateField = async (e, formId, fieldId) => {
    e.preventDefault();
    try {
      let optionsStr = editFieldType === 'select' ? editFieldOptions : null;
      await formApi.updateField(formId, fieldId, { label: editFieldLabel, type: editFieldType, order: editFieldOrder, required: editFieldRequired, options: optionsStr });
      setEditingFieldId(null);
      fetchForms();
    } catch (e) { alert('Error updating field'); }
  };

  const handleDeleteField = async (formId, fieldId) => {
    if (!window.confirm('Delete this field?')) return;
    try {
      await formApi.deleteField(formId, fieldId);
      fetchForms();
    } catch (e) { alert('Error deleting field'); }
  };

  const openEditForm = (form) => {
    setEditingFormId(form.id);
    setEditFormTitle(form.title);
    setEditFormDesc(form.description);
    setEditFormStatus(form.status);
    setEditFormOrder(form.order);
  };

  const openEditField = (field) => {
    setEditingFieldId(field.id);
    setEditFieldLabel(field.label);
    setEditFieldType(field.type);
    setEditFieldOrder(field.order);
    setEditFieldRequired(field.required);
    setEditFieldOptions(field.options || '');
  };

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2.5rem', margin: '0 0 1rem 0' }}>Admin Workspace</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Manage forms, fields and view user submissions.</p>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '2rem', justifyContent: 'center' }}>
        <button onClick={() => setActiveTab('forms')} className={activeTab === 'forms' ? 'btn-primary' : 'btn-secondary'}>Manage Forms</button>
        <button onClick={() => setActiveTab('submissions')} className={activeTab === 'submissions' ? 'btn-primary' : 'btn-secondary'}>View Submissions</button>
      </div>

      {activeTab === 'forms' && (
        <div className="animate-fade-in">
          <div className="glass-card" style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginTop: 0 }}>+ Create New Form</h3>
            <form onSubmit={handleCreateForm} style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <input className="form-input" placeholder="Title" required value={title} onChange={e => setTitle(e.target.value)} />
              </div>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <input className="form-input" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
              </div>
              <div>
                <input className="form-input" type="number" placeholder="Order" value={formOrder} onChange={e => setFormOrder(Number(e.target.value))} style={{width: '80px'}} />
              </div>
              <div>
                <select className="form-select" value={formStatus} onChange={e => setFormStatus(e.target.value)}>
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
              <button type="submit" className="btn-primary">Create</button>
            </form>
          </div>

          <div style={{ display: 'grid', gap: '20px' }}>
            {forms.sort((a,b) => a.order - b.order).map(form => (
              <div key={form.id} className="glass-card" style={{ padding: '1.5rem' }}>
                {/* Form Header */}
                {editingFormId === form.id ? (
                  <form onSubmit={(e) => handleUpdateForm(e, form.id)} style={{ display: 'flex', gap: '10px', marginBottom: '1rem', flexWrap: 'wrap' }}>
                    <input className="form-input" required value={editFormTitle} onChange={e => setEditFormTitle(e.target.value)} />
                    <input className="form-input" value={editFormDesc} onChange={e => setEditFormDesc(e.target.value)} />
                    <input className="form-input" type="number" value={editFormOrder} onChange={e => setEditFormOrder(Number(e.target.value))} style={{width: '80px'}} title="Order" />
                    <select className="form-select" value={editFormStatus} onChange={e => setEditFormStatus(e.target.value)}>
                      <option value="active">Active</option>
                      <option value="draft">Draft</option>
                    </select>
                    <button type="submit" className="btn-primary">Save</button>
                    <button type="button" onClick={() => setEditingFormId(null)} className="btn-secondary">Cancel</button>
                  </form>
                ) : (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <div>
                      <h4 style={{ margin: '0 0 5px 0', fontSize: '1.3rem', color: 'var(--primary)' }}>
                        {form.title} <span style={{fontSize: '0.8rem', padding: '2px 8px', borderRadius: '10px', background: form.status === 'active' ? '#10b981' : '#6b7280'}}>{form.status}</span>
                      </h4>
                      <small style={{ color: 'var(--text-secondary)' }}>{form.description} | Order: {form.order}</small>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button onClick={() => openEditForm(form)} style={{ background: '#f59e0b', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '5px', cursor: 'pointer' }}>Edit</button>
                      <button onClick={() => handleDeleteForm(form.id)} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '5px', cursor: 'pointer' }}>Delete</button>
                    </div>
                  </div>
                )}
                
                {/* Fields List */}
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '10px' }}>
                  <h5 style={{ margin: '0 0 10px 0' }}>Fields ({form.fields?.length || 0}):</h5>
                  <ul style={{ margin: '0 0 15px 0', paddingLeft: '0', listStyle: 'none' }}>
                    {form.fields?.sort((a,b) => a.order - b.order).map(f => (
                      <li key={f.id} style={{ padding: '10px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        {editingFieldId === f.id ? (
                          <form onSubmit={(e) => handleUpdateField(e, form.id, f.id)} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                            <input className="form-input" style={{flex: 1, minWidth: '150px'}} required placeholder="Label" value={editFieldLabel} onChange={e => setEditFieldLabel(e.target.value)} />
                            <select className="form-select" style={{width: 'auto'}} value={editFieldType} onChange={e => setEditFieldType(e.target.value)}>
                              <option value="text">Text (Văn bản)</option>
                              <option value="number">Number (Số 0-100)</option>
                              <option value="date">Date (Ngày tháng)</option>
                              <option value="color">Color (Màu sắc)</option>
                              <option value="select">Select (Dropdown)</option>
                            </select>
                            {editFieldType === 'select' && (
                              <input className="form-input" style={{flex: 1, minWidth: '150px'}} placeholder="Options (comma separated)" required value={editFieldOptions} onChange={e => setEditFieldOptions(e.target.value)} />
                            )}
                            <input className="form-input" type="number" title="Order" value={editFieldOrder} onChange={e => setEditFieldOrder(Number(e.target.value))} style={{width: '70px'}} />
                            <label style={{display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-secondary)'}}>
                              <input type="checkbox" checked={editFieldRequired} onChange={e => setEditFieldRequired(e.target.checked)} /> Req?
                            </label>
                            <button type="submit" className="btn-primary" style={{padding: '8px 15px'}}>Save</button>
                            <button type="button" onClick={() => setEditingFieldId(null)} className="btn-secondary" style={{padding: '8px 15px'}}>Cancel</button>
                          </form>
                        ) : (
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>
                              <span style={{color: 'var(--text-secondary)'}}>[{f.type}]</span> {f.label} 
                              {f.required && <span style={{color: '#f43f5e'}}> *</span>}
                              <span style={{fontSize: '0.8rem', color: 'var(--text-secondary)', marginLeft: '10px'}}>Order: {f.order}</span>
                              {f.type === 'select' && <span style={{fontSize: '0.85rem', color: 'var(--primary)', marginLeft: '10px'}}>(Options: {f.options})</span>}
                            </span>
                            <div style={{display: 'flex', gap: '5px'}}>
                              <button onClick={() => openEditField(f)} style={{ background: 'transparent', color: '#f59e0b', border: '1px solid #f59e0b', padding: '2px 8px', borderRadius: '3px', cursor: 'pointer' }}>✎</button>
                              <button onClick={() => handleDeleteField(form.id, f.id)} style={{ background: 'transparent', color: '#ef4444', border: '1px solid #ef4444', padding: '2px 8px', borderRadius: '3px', cursor: 'pointer' }}>✖</button>
                            </div>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>

                  {/* Add Field Form */}
                  {selectedFormId === form.id ? (
                    <form onSubmit={(e) => handleAddField(e, form.id)} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                      <input className="form-input" style={{flex: 1, minWidth: '150px'}} placeholder="New Question" required value={fieldLabel} onChange={e => setFieldLabel(e.target.value)} />
                      <select className="form-select" style={{width: 'auto'}} value={fieldType} onChange={e => setFieldType(e.target.value)}>
                        <option value="text">Text (Văn bản)</option>
                        <option value="number">Number (Số 0-100)</option>
                        <option value="date">Date (Ngày tháng)</option>
                        <option value="color">Color (Màu sắc)</option>
                        <option value="select">Select (Dropdown)</option>
                      </select>
                      {fieldType === 'select' && (
                        <input className="form-input" style={{flex: 1, minWidth: '150px'}} placeholder="Options (Ex: A, B, C)" required value={fieldOptions} onChange={e => setFieldOptions(e.target.value)} />
                      )}
                      <input className="form-input" type="number" title="Order" value={fieldOrder} onChange={e => setFieldOrder(Number(e.target.value))} style={{width: '70px'}} />
                      <label style={{display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-secondary)'}}>
                        <input type="checkbox" checked={fieldRequired} onChange={e => setFieldRequired(e.target.checked)} /> Req?
                      </label>
                      <button type="submit" className="btn-primary">Save Field</button>
                      <button type="button" onClick={() => setSelectedFormId(null)} className="btn-secondary">Cancel</button>
                    </form>
                  ) : (
                    <button onClick={() => setSelectedFormId(form.id)} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.9rem' }}>+ Add New Field</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: SUBMISSIONS */}
      {activeTab === 'submissions' && (
        <div className="animate-fade-in glass-card">
          <h3 style={{ marginTop: 0, borderBottom: '1px solid var(--surface-border)', paddingBottom: '1rem' }}>User Submissions</h3>
          {submissions.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)' }}>No submissions found yet.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--surface-border)', color: 'var(--primary)' }}>
                    <th style={{ padding: '10px' }}>Time</th>
                    <th style={{ padding: '10px' }}>Submitter</th>
                    <th style={{ padding: '10px' }}>Answers (Raw)</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map(sub => (
                    <tr key={sub.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '10px', color: 'var(--text-secondary)', width: '150px' }}>{new Date(sub.createdAt).toLocaleString()}</td>
                      <td style={{ padding: '10px', fontWeight: 'bold', width: '150px' }}>{sub.submitterName}</td>
                      <td style={{ padding: '10px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        {sub.values.map(v => <div key={v.id}>👉 {v.value}</div>)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminContainer;
