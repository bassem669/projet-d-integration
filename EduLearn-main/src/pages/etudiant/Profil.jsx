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
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    ancienMotDePasse: '',
    nouveauMotDePasse: '',
    confirmerMotDePasse: ''
  });

  // ============================
  // 🔹 CHARGEMENT DU PROFIL
  // ============================
  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/api/profil", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setUser(data);
        setFormData(data);
        setOriginalData(data);
        setLoading(false);
      })
      .catch(() => {
        alert("❌ Erreur lors du chargement du profil");
        setLoading(false);
      });
  }, []);

  // ============================
  // 🔹 HANDLERS
  // ============================
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
    if (!formData.nom || !formData.prenom) {
      alert("Veuillez remplir les champs obligatoires");
      return;
    }

    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/api/profil", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then(() => {
        setUser(formData);
        setIsEditing(false);

        const updatedUser = { ...user, ...formData };
        localStorage.setItem("user", JSON.stringify(updatedUser));

        alert("✅ Profil mis à jour avec succès !");
      })
      .catch(() => {
        alert("❌ Erreur lors de la mise à jour du profil");
      });
  };

  // ============================
  // 🔹 GESTION MOT DE PASSE
  // ============================
  const handleChangePassword = () => {
    setShowPasswordModal(true);
  };

  const handlePasswordInputChange = (field, value) => {
    setPasswordData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePasswordSubmit = () => {
    const { ancienMotDePasse, nouveauMotDePasse, confirmerMotDePasse } = passwordData;

    if (!ancienMotDePasse || !nouveauMotDePasse || !confirmerMotDePasse) {
      alert("Veuillez remplir tous les champs");
      return;
    }

    if (nouveauMotDePasse !== confirmerMotDePasse) {
      alert("Les nouveaux mots de passe ne correspondent pas");
      return;
    }

    if (nouveauMotDePasse.length < 6) {
      alert("Le nouveau mot de passe doit contenir au moins 6 caractères");
      return;
    }

    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/api/changer-mot-de-passe", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ancienMotDePasse,
        nouveauMotDePasse
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          alert("✅ Mot de passe modifié avec succès !");
          setShowPasswordModal(false);
          setPasswordData({
            ancienMotDePasse: '',
            nouveauMotDePasse: '',
            confirmerMotDePasse: ''
          });
        } else {
          alert(data.message || "❌ Erreur lors du changement de mot de passe");
        }
      })
      .catch(() => {
        alert("❌ Erreur lors du changement de mot de passe");
      });
  };

  const closePasswordModal = () => {
    setShowPasswordModal(false);
    setPasswordData({
      ancienMotDePasse: '',
      nouveauMotDePasse: '',
      confirmerMotDePasse: ''
    });
  };

  const hasChanges = () =>
    JSON.stringify(formData) !== JSON.stringify(originalData);

  // ============================
  // 🔹 LOADING
  // ============================
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="dashboard">
          <MenuEtudiant />
          <div className="content text-center py-5">
            <div className="spinner-border text-primary"></div>
          </div>
        </div>
      </>
    );
  }

  // ============================
  // 🔹 RENDER
  // ============================
  return (
    <>
      <Navbar />
      <div className="dashboard">
        <MenuEtudiant />

        <div className="content">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3>Mon Profil</h3>

            {isEditing ? (
              <div className="d-flex gap-2">
                <button className="btn btn-secondary" onClick={handleCancel}>
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
            ) : (
              <button className="btn btn-primary" onClick={handleEdit}>
                ✏️ Modifier le profil
              </button>
            )}
          </div>

          {/* CARD PROFIL */}
          <div className="card-modern p-4">
            <h5 className="mb-4">Informations personnelles</h5>

            <div className="row">
              {/* NOM */}
              <div className="col-md-6 mb-3">
                <label className="form-label">Nom *</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.nom || ''}
                  readOnly={!isEditing}
                  onChange={(e) => handleInputChange("nom", e.target.value)}
                />
              </div>

              {/* PRENOM */}
              <div className="col-md-6 mb-3">
                <label className="form-label">Prénom *</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.prenom || ''}
                  readOnly={!isEditing}
                  onChange={(e) => handleInputChange("prenom", e.target.value)}
                />
              </div>

              {/* EMAIL - CHAMP NON MODIFIABLE */}
              <div className="col-md-6 mb-3">
                <label className="form-label">Email *</label>
                <input
                  type="email"
                  className="form-control"
                  value={formData.email || ''}
                  readOnly={true}
                  style={{ backgroundColor: '#f8f9fa', cursor: 'not-allowed' }}
                />
                <small className="text-muted">L'email ne peut pas être modifié</small>
              </div>

              {/* NIVEAU */}
              <div className="col-md-6 mb-3">
                <label className="form-label">Niveau *</label>
                {isEditing ? (
                  <select
                    className="form-select"
                    value={formData.niveau || ''}
                    onChange={(e) => handleInputChange("niveau", e.target.value)}
                  >
                    <option value="">Sélectionnez un niveau</option>
                    <option>Licence 1</option>
                    <option>Licence 2</option>
                    <option>Licence 3</option>
                    <option>Master 1</option>
                    <option>Master 2</option>
                    <option>Doctorat</option>
                  </select>
                ) : (
                  <input
                    type="text"
                    className="form-control"
                    value={user.niveau || ''}
                    readOnly
                  />
                )}
              </div>

              {/* MOT DE PASSE */}
              <div className="col-12 mb-3">
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
                    onClick={handleChangePassword}
                  >
                    🔒 Changer
                  </button>
                </div>
              </div>
            </div>

            {/* INFOS SUPPLÉMENTAIRES */}
            <div className="row mt-4 border-top pt-3">
              <div className="col-md-6">
                <p>
                  <strong>Membre depuis :</strong>{" "}
                  {new Date(user.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="col-md-6">
                <p><strong>Statut :</strong> <span className="text-success">Actif</span></p>
              </div>
            </div>
          </div>

          {/* MESSAGE CHANGEMENTS */}
          {isEditing && (
            <div className="card-modern p-3 mt-4 text-center text-muted small">
              {hasChanges()
                ? "⚠️ Vous avez des modifications non sauvegardées"
                : "Aucune modification effectuée"}
            </div>
          )}
        </div>
      </div>

      {/* MODAL CHANGEMENT MOT DE PASSE */}
      {showPasswordModal && (
        <div className="modal-backdrop show d-block password-modal-backdrop">
          <div className="modal d-block" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content password-modal-content">

                <div className="modal-header password-modal-header">
                  <h5 className="modal-title">🔒 Changer le mot de passe</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={closePasswordModal}
                  ></button>
                </div>

                <div className="modal-body password-modal-body">
                  <div className="mb-3">
                    <label className="form-label">Ancien mot de passe *</label>
                    <input
                      type="password"
                      className="form-control password-input"
                      value={passwordData.ancienMotDePasse}
                      onChange={(e) => handlePasswordInputChange("ancienMotDePasse", e.target.value)}
                      placeholder="Entrez votre ancien mot de passe"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Nouveau mot de passe *</label>
                    <input
                      type="password"
                      className="form-control password-input"
                      value={passwordData.nouveauMotDePasse}
                      onChange={(e) => handlePasswordInputChange("nouveauMotDePasse", e.target.value)}
                      placeholder="Entrez votre nouveau mot de passe"
                    />
                    <small className="text-muted">Minimum 6 caractères</small>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Confirmer le nouveau mot de passe *</label>
                    <input
                      type="password"
                      className="form-control password-input"
                      value={passwordData.confirmerMotDePasse}
                      onChange={(e) => handlePasswordInputChange("confirmerMotDePasse", e.target.value)}
                      placeholder="Confirmez votre nouveau mot de passe"
                    />
                  </div>
                </div>

                <div className="modal-footer password-modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary password-cancel-btn"
                    onClick={closePasswordModal}
                  >
                    Annuler
                  </button>

                  <button
                    type="button"
                    className="btn btn-primary password-save-btn"
                    onClick={handlePasswordSubmit}
                  >
                     Enregistrer
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}

    </>
  );
};

export default Profil;