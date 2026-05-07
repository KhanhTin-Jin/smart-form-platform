import apiClient from './apiClient';

export const formApi = {
  // Form CRUD
  getAllForms: () => apiClient.get('/forms'),
  getActiveForms: () => apiClient.get('/forms/active'),
  getFormById: (id) => apiClient.get(`/forms/${id}`),
  createForm: (data) => apiClient.post('/forms', data),
  updateForm: (id, data) => apiClient.put(`/forms/${id}`, data),
  deleteForm: (id) => apiClient.delete(`/forms/${id}`),
  submitForm: (id, data) => apiClient.post(`/forms/${id}/submit`, data),

  // Field management
  addField: (formId, data) => apiClient.post(`/forms/${formId}/fields`, data),
  updateField: (formId, fieldId, data) => apiClient.put(`/forms/${formId}/fields/${fieldId}`, data),
  deleteField: (formId, fieldId) => apiClient.delete(`/forms/${formId}/fields/${fieldId}`),
  reorderFields: (formId, fieldIds) => apiClient.put(`/forms/${formId}/fields/reorder`, fieldIds),
};
