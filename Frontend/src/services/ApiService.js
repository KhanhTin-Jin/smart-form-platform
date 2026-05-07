import axios from 'axios';

const API_BASE_URL = 'http://localhost:5282/api';

const ApiService = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const formApi = {
  getAllForms: () => ApiService.get('/forms'),
  getActiveForms: () => ApiService.get('/forms/active'),
  getFormById: (id) => ApiService.get(`/forms/${id}`),
  createForm: (data) => ApiService.post('/forms', data),
  updateForm: (id, data) => ApiService.put(`/forms/${id}`, data),
  deleteForm: (id) => ApiService.delete(`/forms/${id}`),
  submitForm: (id, data) => ApiService.post(`/forms/${id}/submit`, data),
  
  addField: (formId, data) => ApiService.post(`/forms/${formId}/fields`, data),
  updateField: (formId, fieldId, data) => ApiService.put(`/forms/${formId}/fields/${fieldId}`, data),
  deleteField: (formId, fieldId) => ApiService.delete(`/forms/${formId}/fields/${fieldId}`),
  reorderFields: (formId, fieldIds) => ApiService.put(`/forms/${formId}/fields/reorder`, fieldIds),
};

export const submissionApi = {
  getAllSubmissions: () => ApiService.get('/submissions'),
};

export default ApiService;
