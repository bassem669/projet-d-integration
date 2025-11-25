// src/services/resourceService.js
import { API_ENDPOINTS, getAuthHeaders } from './apiConfig';
import axios from "axios";

export const resourceService = {
  // Récupérer les ressources d'un cours
  async getResourcesByCourse(courseId) {
    try {
      const response = await fetch(API_ENDPOINTS.RESOURCES_BY_COURSE(courseId), {
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        // Si le endpoint n'existe pas, retourner un tableau vide
        if (response.status === 404) {
          console.warn(`Endpoint non trouvé pour le cours ${courseId}`);
          return [];
        }
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Transformer les données si nécessaire
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Erreur resourceService.getResourcesByCourse:', error);
      // Retourner un tableau vide en cas d'erreur pour ne pas bloquer l'interface
      return [];
    }
  },

  // Ajouter une ressource
   async addResource(formData) {
    try {
      const response = await axios.post(API_ENDPOINTS.RESOURCES, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          // Vous pouvez gérer la progression ici si nécessaire
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors de l\'ajout de la ressource');
    }
  },

  // Supprimer une ressource
  async deleteResource(resourceId) {
    try {
      const response = await fetch(`${API_ENDPOINTS.RESOURCES}/${resourceId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la suppression de la ressource');
      }

      return { success: true };
    } catch (error) {
      console.error('Erreur resourceService.deleteResource:', error);
      throw error;
    }
  }
};