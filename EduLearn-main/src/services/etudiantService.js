// services/etudiantService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const etudiantService = {
  // Récupérer les étudiants des cours d'un enseignant
  getEtudiantsByEnseignant: async (idEnseignant) => {
    try {
      const response = await axios.get(`${API_URL}/cours/enseignant/${idEnseignant}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Version simple si vous préférez
  getEtudiantsByEnseignantSimple: async (idEnseignant) => {
    try {
      const response = await axios.get(`${API_URL}/cours/enseignant/${idEnseignant}/simple`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};