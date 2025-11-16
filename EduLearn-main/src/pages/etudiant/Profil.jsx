import React, { useState, useEffect } from 'react';
import Navbar from "../Navbar";
import MenuEtudiant from './MenuEtudiant';
import './theme_etudiant.css';

const Profil = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [originalData, setOriginalData] = useState({});

  useEffect(() => {
    // Simulation appel API
    setTimeout(() => {
      const userData = {
        idUtilisateur: 1,
        nom: "Dupont",
        prenom: "Marie",
        email: "marie.dupont@example.com",
        motDePasse: "********", // Mot de passe masqué
        niveau: "Licence 3",
        role: "etudiant",
        created_at: "2025-11-10"
      };
      setUser(userData);
      setFormData(userData);
      setOriginalData(userData);
      setLoading(false);
    }, 500);
  }, []);

  // 🔧 LOGIQUE DE MODIFICATION

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEdit = () => {
    setIsEditing(true);
    setOriginalData(formData);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData(originalData);
  };

  const handleSave = () => {
    // Validation des données
    if (!formData.nom || !formData.prenom || !formData.email) {
      alert("Veuillez remplir les champs obligatoires");
      return;
    }

    if (formData.email && !isValidEmail(formData.email)) {
      alert("Veuillez entrer un email valide");
      return;
    }

    // Simulation sauvegarde
    console.log("Données sauvegardées:", {
      nom: formData.nom,
      prenom: formData.prenom,
      email: formData.email,
      niveau: formData.niveau
      // Le mot de passe serait géré séparément
    });

    setUser(formData);
    setIsEditing(false);
    
    // Mise à jour localStorage
    const updatedUser = { ...user, ...formData };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    alert("✅ Profil mis à jour avec succès !");
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const hasChanges = () => {
    return JSON.stringify(formData) !== JSON.stringify(originalData);
  };

  const handleChangePassword = () => {
    alert("Fonctionnalité de changement de mot de passe à implémenter");
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="dashboard">
          <MenuEtudiant />
          <div className="content">
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Chargement...</span>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="dashboard">
        <MenuEtudiant />
        
        <div className="content">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3>Mon Profil</h3>
            <button 
              className={`btn ${isEditing ? 'btn-success' : 'btn-primary'}`}
              onClick={isEditing ? handleSave : handleEdit}
              disabled={isEditing && !hasChanges()}
            >
              {isEditing ? '💾 Sauvegarder' : '✏️ Modifier le profil'}
            </button>
          </div>
          
          {/* Informations principales */}
          <div className="card-modern p-4">
            <h5 className="mb-4">Informations personnelles</h5>
            
            <div className="row">
              {/* Nom */}
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Nom *</label>
                  {isEditing ? (
                    <input 
                      type="text" 
                      className="form-control" 
                      value={formData.nom} 
                      onChange={(e) => handleInputChange('nom', e.target.value)}
                      placeholder="Votre nom"
                    />
                  ) : (
                    <input type="text" className="form-control" value={user.nom} readOnly />
                  )}
                </div>
              </div>

              {/* Prénom */}
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Prénom *</label>
                  {isEditing ? (
                    <input 
                      type="text" 
                      className="form-control" 
                      value={formData.prenom} 
                      onChange={(e) => handleInputChange('prenom', e.target.value)}
                      placeholder="Votre prénom"
                    />
                  ) : (
                    <input type="text" className="form-control" value={user.prenom} readOnly />
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Email *</label>
                  {isEditing ? (
                    <input 
                      type="email" 
                      className="form-control" 
                      value={formData.email} 
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="votre@email.com"
                    />
                  ) : (
                    <input type="email" className="form-control" value={user.email} readOnly />
                  )}
                </div>
              </div>

              {/* Niveau */}
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Niveau *</label>
                  {isEditing ? (
                    <select 
                      className="form-select"
                      value={formData.niveau}
                      onChange={(e) => handleInputChange('niveau', e.target.value)}
                    >
                      <option value="Licence 1">Licence 1</option>
                      <option value="Licence 2">Licence 2</option>
                      <option value="Licence 3">Licence 3</option>
                      <option value="Master 1">Master 1</option>
                      <option value="Master 2">Master 2</option>
                      <option value="Doctorat">Doctorat</option>
                    </select>
                  ) : (
                    <input type="text" className="form-control" value={user.niveau} readOnly />
                  )}
                </div>
              </div>

              {/* Mot de passe (toujours en lecture seule) */}
              <div className="col-12">
                <div className="mb-3">
                  <label className="form-label">Mot de passe</label>
                  <div className="input-group">
                    <input 
                      type="password" 
                      className="form-control" 
                      value="********" 
                      readOnly 
                    />
                    <button 
                      className="btn btn-outline-primary"
                      type="button"
                      onClick={handleChangePassword}
                    >
                      🔒 Changer
                    </button>
                  </div>
                  <div className="form-text">
                    Le mot de passe ne peut pas être modifié ici. Utilisez le bouton "Changer".
                  </div>
                </div>
              </div>
            </div>

            {/* Informations supplémentaires (lecture seule) */}
            <div className="row mt-4 pt-3 border-top">
              <div className="col-md-6">
                <div className="mb-2">
                  <strong>Rôle:</strong> {user.role}
                </div>
                <div className="mb-2">
                  <strong>Membre depuis:</strong> {new Date(user.created_at).toLocaleDateString()}
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-2">
                  <strong>Statut:</strong> <span className="text-success">Actif</span>
                </div>
                <div className="mb-2">
                  <strong>ID Utilisateur:</strong> {user.idUtilisateur}
                </div>
              </div>
            </div>
          </div>

          {/* Boutons en mode édition */}
          {isEditing && (
            <div className="card-modern p-4 mt-4">
              <div className="d-flex gap-2 justify-content-between align-items-center">
                <div className="text-muted small">
                  {hasChanges() ? "⚠️ Modifications non sauvegardées" : "Aucune modification"}
                </div>
                <div className="d-flex gap-2">
                  <button 
                    className="btn btn-secondary"
                    onClick={handleCancel}
                  >
                    ❌ Annuler
                  </button>
                  <button 
                    className="btn btn-success"
                    onClick={handleSave}
                    disabled={!hasChanges()}
                  >
                    💾 Sauvegarder
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Profil;