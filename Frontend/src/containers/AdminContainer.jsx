import React, { useEffect, useState } from 'react';
import { formApi, submissionApi } from '../services';
import { parseOptions } from '../utils';

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
  const [fieldOptionsList, setFieldOptionsList] = useState(['Option 1', 'Option 2']);
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
  const [editFieldOptionsList, setEditFieldOptionsList] = useState([]);
  const [editFieldOrder, setEditFieldOrder] = useState(1);
  const [editFieldRequired, setEditFieldRequired] = useState(true);

  // Drag and Drop State
  const [draggedFieldId, setDraggedFieldId] = useState(null);

  useEffect(() => {
    fetchForms();
    fetchSubmissions();
  }, []);

  // Auto-track next Form Order
  useEffect(() => {
    if (title === '' && !editingFormId) {
      setFormOrder(forms.length + 1);
    }
  }, [forms, title, editingFormId]);

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
    if (formOrder < 1) return alert('Order cannot be less than 1');
    try {
      await formApi.createForm({ title, description, order: formOrder, status: formStatus });
      setTitle(''); setDescription(''); setFormOrder(1); setFormStatus('active');
      fetchForms();
    } catch (error) { alert(error.response?.data?.message || 'Error creating form'); }
  };

  const handleUpdateForm = async (e, formId) => {
    e.preventDefault();
    if (editFormOrder < 1) return alert('Order cannot be less than 1');
    try {
      await formApi.updateForm(formId, { title: editFormTitle, description: editFormDesc, status: editFormStatus, order: editFormOrder });
      setEditingFormId(null);
      fetchForms();
    } catch (e) { alert(e.response?.data?.message || 'Error updating form'); }
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
    if (fieldOrder < 1) return alert('Order cannot be less than 1');
    try {
      let optionsStr = fieldType === 'select' ? fieldOptionsList.filter(o => o.trim()).join(',') : null;
      await formApi.addField(formId, { label: fieldLabel, type: fieldType, order: fieldOrder, required: fieldRequired, options: optionsStr });
      setFieldLabel(''); setFieldType('text'); setFieldOptionsList(['Option 1', 'Option 2']); setFieldOrder(1); setFieldRequired(true); setSelectedFormId(null);
      fetchForms();
    } catch (error) { alert(error.response?.data?.message || 'Error adding field'); }
  };

  const handleUpdateField = async (e, formId, fieldId) => {
    e.preventDefault();
    if (editFieldOrder < 1) return alert('Order cannot be less than 1');
    try {
      let optionsStr = editFieldType === 'select' ? editFieldOptionsList.filter(o => o.trim()).join(',') : null;
      await formApi.updateField(formId, fieldId, { label: editFieldLabel, type: editFieldType, order: editFieldOrder, required: editFieldRequired, options: optionsStr });
      setEditingFieldId(null);
      fetchForms();
    } catch (e) { alert(e.response?.data?.message || 'Error updating field'); }
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

  const openAddField = (form) => {
    setSelectedFormId(form.id);
    setFieldOrder((form.fields?.length || 0) + 1);
  };

  const openEditField = (field) => {
    setEditingFieldId(field.id);
    setEditFieldLabel(field.label);
    setEditFieldType(field.type);
    setEditFieldOrder(field.order);
    setEditFieldRequired(field.required);
    if (field.type === 'select') {
      const parsed = parseOptions(field.options);
      setEditFieldOptionsList(parsed.length > 0 ? parsed : ['']);
    } else {
      setEditFieldOptionsList([]);
    }
  };

  // --- OPTIONS DYNAMIC LIST ---
  const handleOptionChange = (index, value, isEdit) => {
    if (isEdit) {
      const newOpts = [...editFieldOptionsList];
      newOpts[index] = value;
      setEditFieldOptionsList(newOpts);
    } else {
      const newOpts = [...fieldOptionsList];
      newOpts[index] = value;
      setFieldOptionsList(newOpts);
    }
  };

  const removeOption = (index, isEdit) => {
    if (isEdit) {
      setEditFieldOptionsList(editFieldOptionsList.filter((_, i) => i !== index));
    } else {
      setFieldOptionsList(fieldOptionsList.filter((_, i) => i !== index));
    }
  };

  const addOption = (isEdit) => {
    if (isEdit) {
      setEditFieldOptionsList([...editFieldOptionsList, '']);
    } else {
      setFieldOptionsList([...fieldOptionsList, '']);
    }
  };

  // --- DRAG AND DROP & MANUAL REORDER LOGIC ---
  const handleDragStart = (e, fieldId) => {
    setDraggedFieldId(fieldId);
    e.dataTransfer.effectAllowed = 'move';
    setTimeout(() => {
      e.target.style.opacity = '0.5';
    }, 0);
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = '1';
    setDraggedFieldId(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e, form, targetFieldId) => {
    e.preventDefault();
    if (!draggedFieldId || draggedFieldId === targetFieldId) return;

    const currentFields = [...form.fields].sort((a,b) => a.order - b.order);
    const draggedIndex = currentFields.findIndex(f => f.id === draggedFieldId);
    const targetIndex = currentFields.findIndex(f => f.id === targetFieldId);
    
    if (draggedIndex === -1 || targetIndex === -1) return;

    // Reorder in memory
    const newFields = [...currentFields];
    const [removed] = newFields.splice(draggedIndex, 1);
    newFields.splice(targetIndex, 0, removed);

    await saveReorder(form, newFields);
  };

  const handleMoveUp = async (form, index) => {
    if (index === 0) return;
    const currentFields = [...form.fields].sort((a,b) => a.order - b.order);
    const newFields = [...currentFields];
    const temp = newFields[index - 1];
    newFields[index - 1] = newFields[index];
    newFields[index] = temp;
    
    await saveReorder(form, newFields);
  };

  const handleMoveDown = async (form, index) => {
    const currentFields = [...form.fields].sort((a,b) => a.order - b.order);
    if (index === currentFields.length - 1) return;
    const newFields = [...currentFields];
    const temp = newFields[index + 1];
    newFields[index + 1] = newFields[index];
    newFields[index] = temp;

    await saveReorder(form, newFields);
  };

  const saveReorder = async (form, newFieldsArray) => {
    // Optimistically update UI
    const updatedForm = { ...form, fields: newFieldsArray.map((f, i) => ({ ...f, order: i + 1 })) };
    setForms(forms.map(f => f.id === form.id ? updatedForm : f));

    try {
      // Use the new bulk reorder API to avoid duplicate order validation failures
      const orderedIds = newFieldsArray.map(f => f.id);
      await formApi.reorderFields(form.id, orderedIds);
      // fetchForms(); // Usually optional, but good for sync
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving new field order.');
      fetchForms(); // Rollback UI if fail
    }
  };

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
        <h2 style={{ fontSize: '3rem', margin: '0 0 1rem 0', background: 'linear-gradient(to right, var(--text-primary), var(--primary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 800 }}>
          Admin Workspace
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Manage forms, fields and analyze user engagement in real-time.</p>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '3rem', justifyContent: 'center', background: 'rgba(255, 255, 255, 0.5)', padding: '6px', borderRadius: 'var(--radius-full)', width: 'fit-content', margin: '0 auto 3rem auto', border: '1px solid var(--surface-border)', backdropFilter: 'blur(8px)' }}>
        <button 
          onClick={() => setActiveTab('forms')} 
          className={activeTab === 'forms' ? 'btn-primary' : 'btn-secondary'}
          style={{ borderRadius: 'var(--radius-full)', border: 'none', boxShadow: activeTab === 'forms' ? '0 4px 12px var(--primary-glow)' : 'none' }}
        >
          <span style={{ fontSize: '1.1rem' }}>📝</span> Manage Forms
        </button>
        <button 
          onClick={() => setActiveTab('submissions')} 
          className={activeTab === 'submissions' ? 'btn-primary' : 'btn-secondary'}
          style={{ borderRadius: 'var(--radius-full)', border: 'none', boxShadow: activeTab === 'submissions' ? '0 4px 12px var(--primary-glow)' : 'none' }}
        >
          <span style={{ fontSize: '1.1rem' }}>📊</span> View Submissions
        </button>
      </div>

      {activeTab === 'forms' && (
        <div className="animate-fade-in">
          <div className="glass-card" style={{ marginBottom: '3rem', border: '2px solid var(--primary-glow)' }}>
            <h3 style={{ marginTop: 0, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ background: 'var(--primary)', color: 'white', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>+</span>
              Create New Form
            </h3>
            <form onSubmit={handleCreateForm} style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
              <div style={{ flex: 1.5, minWidth: '240px' }}>
                <label className="form-label">Form Title</label>
                <input className="form-input" placeholder="e.g. Customer Satisfaction Survey" required value={title} onChange={e => setTitle(e.target.value)} />
              </div>
              <div style={{ flex: 2, minWidth: '300px' }}>
                <label className="form-label">Description</label>
                <input className="form-input" placeholder="What is this form about?" value={description} onChange={e => setDescription(e.target.value)} />
              </div>
              <div style={{ width: '100px' }}>
                <label className="form-label">Order</label>
                <input className="form-input" type="number" min="1" placeholder="Order" value={formOrder} onChange={e => setFormOrder(Number(e.target.value))} title="Order" />
              </div>
              <div style={{ width: '120px' }}>
                <label className="form-label">Status</label>
                <select className="form-select" value={formStatus} onChange={e => setFormStatus(e.target.value)}>
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
              <button type="submit" className="btn-primary" style={{ padding: '12px 30px' }}>Create Form</button>
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
                    <input className="form-input" type="number" min="1" value={editFormOrder} onChange={e => setEditFormOrder(Number(e.target.value))} style={{width: '80px'}} title="Order" />
                    <select className="form-select" value={editFormStatus} onChange={e => setEditFormStatus(e.target.value)}>
                      <option value="active">Active</option>
                      <option value="draft">Draft</option>
                    </select>
                    <button type="submit" className="btn-primary">Save</button>
                    <button type="button" onClick={() => setEditingFormId(null)} className="btn-secondary">Cancel</button>
                  </form>
                ) : (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <h4 style={{ margin: 0, fontSize: '1.6rem', color: 'var(--text-primary)', fontWeight: 800 }}>
                          {form.title}
                        </h4>
                        <span style={{ 
                          fontSize: '0.75rem', 
                          padding: '4px 12px', 
                          borderRadius: 'var(--radius-full)', 
                          background: form.status === 'active' ? 'var(--success)' : 'var(--text-tertiary)', 
                          color: 'white',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em'
                        }}>
                          {form.status}
                        </span>
                      </div>
                      <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '1rem' }}>
                        {form.description} <span style={{ color: 'var(--text-tertiary)', margin: '0 8px' }}>&bull;</span> 
                        <span style={{ fontWeight: 600 }}>Order: {form.order}</span>
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => openEditForm(form)} className="btn-secondary" style={{ padding: '8px 16px' }}>
                        <span>✏️</span> Edit
                      </button>
                      <button onClick={() => handleDeleteForm(form.id)} className="btn-secondary" style={{ padding: '8px 16px', color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
                        <span>🗑️</span> Delete
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Fields List */}
                <div style={{ background: 'rgba(0, 177, 79, 0.02)', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--surface-border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h5 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>
                      Questions <span style={{ color: 'var(--text-tertiary)', fontWeight: 400, marginLeft: '4px' }}>({form.fields?.length || 0})</span>
                    </h5>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>🖱️</span> Drag to reorder
                    </div>
                  </div>
                  
                  <ul style={{ margin: '0 0 20px 0', paddingLeft: '0', listStyle: 'none' }}>
                    {form.fields?.sort((a,b) => a.order - b.order).map((f, index) => (
                      <li 
                        key={f.id} 
                        draggable
                        onDragStart={(e) => handleDragStart(e, f.id)}
                        onDragEnd={handleDragEnd}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, form, f.id)}
                        style={{ 
                          padding: '15px', 
                          border: '1px solid var(--surface-border)', 
                          borderRadius: '8px', 
                          marginBottom: '10px', 
                          background: '#fff',
                          boxShadow: draggedFieldId === f.id ? '0 5px 15px rgba(0,0,0,0.1)' : 'none',
                          transition: 'all 0.2s ease',
                          display: 'flex',
                          gap: '15px',
                          alignItems: 'flex-start'
                        }}
                      >
                        {/* Drag Handle & Manual Arrows */}
                        {editingFieldId !== f.id && (
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', color: '#9ca3af' }}>
                            <button onClick={() => handleMoveUp(form, index)} disabled={index === 0} style={{ background: 'none', border: 'none', cursor: index === 0 ? 'not-allowed' : 'pointer', opacity: index === 0 ? 0.3 : 1 }}>▲</button>
                            <div style={{ cursor: 'grab', fontSize: '1.2rem', padding: '0 5px' }} title="Drag to reorder">⋮⋮</div>
                            <button onClick={() => handleMoveDown(form, index)} disabled={index === (form.fields?.length - 1)} style={{ background: 'none', border: 'none', cursor: index === (form.fields?.length - 1) ? 'not-allowed' : 'pointer', opacity: index === (form.fields?.length - 1) ? 0.3 : 1 }}>▼</button>
                          </div>
                        )}

                        <div style={{ flex: 1 }}>
                          {editingFieldId === f.id ? (
                            <form onSubmit={(e) => handleUpdateField(e, form.id, f.id)} style={{ background: '#f9fafb', padding: '15px', borderRadius: '8px' }}>
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                                <div>
                                  <label className="form-label">Question Label</label>
                                  <input className="form-input" required value={editFieldLabel} onChange={e => setEditFieldLabel(e.target.value)} />
                                </div>
                                <div>
                                  <label className="form-label">Type</label>
                                  <select className="form-select" value={editFieldType} onChange={e => setEditFieldType(e.target.value)}>
                                    <option value="text">Text (Văn bản)</option>
                                    <option value="number">Number (Số 0-100)</option>
                                    <option value="date">Date (Ngày tháng)</option>
                                    <option value="color">Color (Màu sắc)</option>
                                    <option value="select">Select (Dropdown)</option>
                                  </select>
                                </div>
                                {editFieldType === 'select' && (
                                  <div style={{ gridColumn: '1 / -1', background: '#fff', padding: '15px', border: '1px solid var(--surface-border)', borderRadius: '8px' }}>
                                    <label className="form-label">Manage Dropdown Options</label>
                                    {editFieldOptionsList.map((opt, idx) => (
                                      <div key={idx} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                        <input 
                                          className="form-input" 
                                          value={opt} 
                                          onChange={(e) => handleOptionChange(idx, e.target.value, true)} 
                                          placeholder={`Option ${idx + 1}`}
                                          required
                                        />
                                        {editFieldOptionsList.length > 1 && (
                                          <button type="button" onClick={() => removeOption(idx, true)} className="btn-secondary" style={{ padding: '5px 15px', color: 'var(--danger)' }}>X</button>
                                        )}
                                      </div>
                                    ))}
                                    <button type="button" onClick={() => addOption(true)} className="btn-secondary" style={{ marginTop: '5px', fontSize: '0.85rem' }}>+ Add Option</button>
                                  </div>
                                )}
                                <div>
                                  <label className="form-label">Order</label>
                                  <input className="form-input" type="number" min="1" value={editFieldOrder} onChange={e => setEditFieldOrder(Number(e.target.value))} />
                                </div>
                                <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '10px' }}>
                                  <label style={{display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500, cursor: 'pointer'}}>
                                    <input type="checkbox" checked={editFieldRequired} onChange={e => setEditFieldRequired(e.target.checked)} style={{transform: 'scale(1.2)'}} /> 
                                    Required (Bắt buộc)
                                  </label>
                                </div>
                              </div>
                              <div style={{ display: 'flex', gap: '10px' }}>
                                <button type="submit" className="btn-primary">Save Changes</button>
                                <button type="button" onClick={() => setEditingFieldId(null)} className="btn-secondary">Cancel</button>
                              </div>
                            </form>
                          ) : (
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                              <div style={{ width: '100%', paddingRight: '20px' }}>
                                <div style={{ fontWeight: 600, marginBottom: '10px', color: 'var(--text-primary)' }}>
                                  {f.label} {f.required && <span style={{color: '#d93025'}}>*</span>}
                                  <span style={{fontSize: '0.75rem', background: '#f3f4f6', padding: '3px 8px', borderRadius: '4px', marginLeft: '10px', color: '#4b5563', border: '1px solid #e5e7eb'}}>{f.type}</span>
                                  <span style={{fontSize: '0.75rem', color: '#6b7280', marginLeft: '10px'}}>Order: {f.order}</span>
                                </div>
                                
                                {/* --- UI PREVIEW --- */}
                                <div>
                                  {f.type === 'text' && <input className="form-input" disabled placeholder="Text answer preview..." style={{background: '#f9fafb'}} />}
                                  {f.type === 'number' && <input className="form-input" type="number" disabled placeholder="0" style={{background: '#f9fafb'}} />}
                                  {f.type === 'date' && <input className="form-input" type="date" disabled style={{background: '#f9fafb'}} />}
                                  {f.type === 'color' && <input className="form-input" type="color" disabled value="#00b14f" style={{ height: '40px', width: '60px', padding: '2px', background: '#f9fafb' }} />}
                                  {f.type === 'select' && (
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                      {parseOptions(f.options).map((opt, idx) => (
                                        <div key={idx} style={{ background: '#e0f2fe', color: '#0369a1', padding: '4px 10px', borderRadius: '15px', fontSize: '0.85rem', border: '1px solid #bae6fd' }}>
                                          ○ {opt}
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div style={{display: 'flex', gap: '8px', flexShrink: 0}}>
                                <button onClick={() => openEditField(f)} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>Edit</button>
                                <button onClick={() => handleDeleteField(form.id, f.id)} style={{ background: 'var(--danger)', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}>Delete</button>
                              </div>
                            </div>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>

                  {/* Add Field Form */}
                  {selectedFormId === form.id ? (
                    <div style={{ border: '2px dashed var(--surface-border)', padding: '20px', borderRadius: '8px', background: '#f9fafb' }}>
                      <h4 style={{marginTop: 0, marginBottom: '15px'}}>Add New Field</h4>
                      <form onSubmit={(e) => handleAddField(e, form.id)}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                          <div>
                            <label className="form-label">Question Label</label>
                            <input className="form-input" required value={fieldLabel} onChange={e => setFieldLabel(e.target.value)} />
                          </div>
                          <div>
                            <label className="form-label">Type</label>
                            <select className="form-select" value={fieldType} onChange={e => setFieldType(e.target.value)}>
                              <option value="text">Text (Văn bản)</option>
                              <option value="number">Number (Số 0-100)</option>
                              <option value="date">Date (Ngày tháng)</option>
                              <option value="color">Color (Màu sắc)</option>
                              <option value="select">Select (Dropdown)</option>
                            </select>
                          </div>
                          {fieldType === 'select' && (
                            <div style={{ gridColumn: '1 / -1', background: '#fff', padding: '15px', border: '1px solid var(--surface-border)', borderRadius: '8px' }}>
                              <label className="form-label">Manage Dropdown Options</label>
                              {fieldOptionsList.map((opt, idx) => (
                                <div key={idx} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                  <input 
                                    className="form-input" 
                                    value={opt} 
                                    onChange={(e) => handleOptionChange(idx, e.target.value, false)} 
                                    placeholder={`Option ${idx + 1}`}
                                    required
                                  />
                                  {fieldOptionsList.length > 1 && (
                                    <button type="button" onClick={() => removeOption(idx, false)} className="btn-secondary" style={{ padding: '5px 15px', color: 'var(--danger)' }}>X</button>
                                  )}
                                </div>
                              ))}
                              <button type="button" onClick={() => addOption(false)} className="btn-secondary" style={{ marginTop: '5px', fontSize: '0.85rem' }}>+ Add Option</button>
                            </div>
                          )}
                          <div>
                            <label className="form-label">Order</label>
                            <input className="form-input" type="number" min="1" value={fieldOrder} onChange={e => setFieldOrder(Number(e.target.value))} />
                          </div>
                          <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '10px' }}>
                            <label style={{display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500, cursor: 'pointer'}}>
                              <input type="checkbox" checked={fieldRequired} onChange={e => setFieldRequired(e.target.checked)} style={{transform: 'scale(1.2)'}} /> 
                              Required (Bắt buộc)
                            </label>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <button type="submit" className="btn-primary">Save Field</button>
                          <button type="button" onClick={() => setSelectedFormId(null)} className="btn-secondary">Cancel</button>
                        </div>
                      </form>
                    </div>
                  ) : (
                    <button onClick={() => openAddField(form)} className="btn-secondary" style={{ width: '100%', borderStyle: 'dashed', borderWidth: '2px' }}>+ Add New Question</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: SUBMISSIONS */}
      {activeTab === 'submissions' && (
        <div className="animate-fade-in glass-card" style={{ padding: '2.5rem' }}>
          <div style={{ marginBottom: '2.5rem' }}>
            <h3 style={{ marginTop: 0, fontSize: '1.8rem', fontWeight: 800 }}>User Submissions</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Review and analyze data collected from your active forms.</p>
          </div>
          
          {submissions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 0' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌑</div>
              <p style={{ color: 'var(--text-tertiary)', fontSize: '1.1rem' }}>No submissions found yet. Share your form to start collecting data!</p>
            </div>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Time Submitted</th>
                    <th>Submitter Name</th>
                    <th>Form Responses</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map(sub => (
                    <tr key={sub.id}>
                      <td style={{ width: '220px', fontWeight: 500 }}>
                        {new Date(sub.createdAt).toLocaleString('vi-VN', { 
                          dateStyle: 'medium', 
                          timeStyle: 'short' 
                        })}
                      </td>
                      <td style={{ width: '200px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '32px', height: '32px', background: 'var(--primary-glow)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem' }}>👤</div>
                          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{sub.submitterName}</span>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                          {sub.values.map(v => (
                            <div key={v.id} style={{ background: 'var(--bg-color)', padding: '6px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--surface-border)', fontSize: '0.85rem' }}>
                              <span style={{ color: 'var(--primary)', fontWeight: 600 }}>&rarr;</span> {v.value}
                            </div>
                          ))}
                        </div>
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
