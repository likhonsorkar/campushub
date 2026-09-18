import API from './api';

export const getResources = () => API.get('resources/');

export const getResourceById = (id) => API.get(`resources/${id}/`);

// Multipart file upload support for Django Backend
export const createResource = (formData) =>
  API.post('resources/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

export const deleteResource = (id) => API.delete(`resources/${id}/`);

export const getDepartments = () => API.get('resources/departments/');

export const getSubjects = () => API.get('resources/subjects/');