// src/services/courseService.js
import { API_ENDPOINTS, getAuthHeaders } from './apiConfig';
import axios from "axios";


export const courseService = {

  getCoursByEnseignant: async (idUtilisateur) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/cours/enseignant/${idUtilisateur}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Récupérer tous les cours
  async getAllCourses() {
    try {
      const response = await fetch(API_ENDPOINTS.COURSES, {
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Transformer les données pour correspondre au format attendu par le composant
      return data.map(course => ({
        id: course.idCours,
        title: course.titre,
        description: course.description,
        date: course.DateCours ? new Date(course.DateCours).toISOString().split('T')[0] : '',
        teacher: course.nomUtilisateur || 'Non assigné',
        classe: course.nomClasse || 'Non spécifiée',
        resources: course.resources,
        idUtilisateur: course.idUtilisateur
      }));
    } catch (error) {
      console.error('Erreur courseService.getAllCourses:', error);
      throw error;
    }
  },

  // Créer un cours
  async createCourse(courseData) {
    try {
      const response = await fetch(API_ENDPOINTS.COURSES, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          titre: courseData.titre,
          description: courseData.description,
          DateCours: courseData.DateCours,
          idClasse: courseData.idClasse || 2, // Valeur par défaut temporaire
          idUtilisateur: courseData.idUtilisateur
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la création du cours');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur courseService.createCourse:', error);
      throw error;
    }
  },

  // Mettre à jour un cours
  async updateCourse(courseId, courseData) {
    try {
        console.log(courseData);
      const response = await fetch(`${API_ENDPOINTS.COURSES}/${courseId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          titre: courseData.titre,
          description: courseData.description,
          DateCours: courseData.DateCours,
          idClasse: courseData.idClasse || 2,
          idUtilisateur: courseData.idUtilisateur
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la mise à jour du cours');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur courseService.updateCourse:', error);
      throw error;
    }
  },

  // Supprimer un cours
  async deleteCourse(id) {
    try {
      const response = await fetch(`${API_ENDPOINTS.COURSES}/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la suppression du cours');
      }

      return { success: true };
    } catch (error) {
      console.error('Erreur courseService.deleteCourse:', error);
      throw error;
    }
  }
};