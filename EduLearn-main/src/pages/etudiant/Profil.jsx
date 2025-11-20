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

  // ============================
  // 🔹 CHARGEMENT DU PROFIL
  // ============================
  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/api/profil", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // 🔥 envoi du token
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
    if (!formData.nom || !formData.prenom || !formData.email) {
      alert("Veuillez remplir les champs obligatoires");
      return;
    }
    if (!isValidEmail(formData.email)) {
      alert("Veuillez entrer un email valide");
      return;
    }

    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/api/profil", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // 🔥 token dans PUT
      },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then(() => {
        setUser(formData);
        setIsEditing(false);

        // 🔄 Mise à jour du localStorage
        const updatedUser = { ...user, ...formData };
        localStorage.setItem("user", JSON.stringify(updatedUser));

        alert("✅ Profil mis à jour avec succès !");
      })
      .catch(() => {
        alert("❌ Erreur lors de la mise à jour du profil");
      });
  };

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const hasChanges = () =>
    JSON.stringify(formData) !== JSON.stringify(originalData);

  const handleChangePassword = () => {
    alert("🔐 Fonction changement de mot de passe à implémenter");
  };

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
                  value={formData.nom}
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
                  value={formData.prenom}
                  readOnly={!isEditing}
                  onChange={(e) => handleInputChange("prenom", e.target.value)}
                />
              </div>

              {/* EMAIL */}
              <div className="col-md-6 mb-3">
                <label className="form-label">Email *</label>
                <input
                  type="email"
                  className="form-control"
                  value={formData.email}
                  readOnly={!isEditing}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />
              </div>

              {/* NIVEAU */}
              <div className="col-md-6 mb-3">
                <label className="form-label">Niveau *</label>
                {isEditing ? (
                  <select
                    className="form-select"
                    value={formData.niveau}
                    onChange={(e) => handleInputChange("niveau", e.target.value)}
                  >
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
                    value={user.niveau}
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
                <p><strong>Rôle :</strong> {user.role}</p>
                <p>
                  <strong>Membre depuis :</strong>{" "}
                  {new Date(user.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="col-md-6">
                <p><strong>Statut :</strong> <span className="text-success">Actif</span></p>
                <p><strong>ID utilisateur :</strong> {user.idUtilisateur}</p>
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
    </>
  );
};

export default Profil;
