import apiClient from './apiClient';

export const submissionApi = {
  getAllSubmissions: () => apiClient.get('/submissions'),
};
