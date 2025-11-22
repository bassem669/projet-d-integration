import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./TeacherDashboard.css";

export default function Profil() {
  const [teacher, setTeacher] = useState({
    name: "",
    surname: "",
    email: "",
    phone: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // ================================
  // 🔹 Notification simple
  // ================================
  const showNotification = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  // ================================
  // 🔹 Charger profil utilisateur
  // ================================
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
        setTeacher({
          name: data.nom || "",
          surname: data.prenom || "",
          email: data.email || "",
          phone: data.phone || "",
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      })
      .catch(() => {
        showNotification("error", "Erreur lors du chargement du profil...");
      });
  }, []);

  // ================================
  // 🔹 Mettre à jour les informations générales
  // ================================
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const updatedData = {
      nom: teacher.name,
      prenom: teacher.surname,
      email: teacher.email,
      phone: teacher.phone,
    };

    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:5000/api/profil", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        showNotification("success", "Profil mis à jour avec succès !");
        setTeacher({
          ...teacher,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        showNotification("error", "Erreur lors de la mise à jour du profil...");
      }
    } catch (error) {
      showNotification("error", "Erreur réseau lors de la mise à jour du profil...");
    } finally {
      setIsLoading(false);
    }
  };

  // ================================
  // 🔹 Changer le mot de passe
  // ================================
  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (!teacher.currentPassword) {
      showNotification("error", "Veuillez saisir votre mot de passe actuel.");
      return;
    }

    if (!teacher.newPassword) {
      showNotification("error", "Veuillez saisir un nouveau mot de passe.");
      return;
    }

    if (teacher.newPassword.length < 6) {
      showNotification("error", "Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    if (teacher.newPassword !== teacher.confirmPassword) {
      showNotification("error", "Les nouveaux mots de passe ne correspondent pas.");
      return;
    }

    setIsLoading(true);

    const passwordData = {
      currentPassword: teacher.currentPassword,
      newPassword: teacher.newPassword,
    };

    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:5000/api/profil/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(passwordData),
      });

      const data = await response.json();

      if (response.ok) {
        showNotification("success", "Mot de passe changé avec succès !");
        setTeacher({
          ...teacher,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        showNotification("error", data.message || "Erreur lors du changement de mot de passe.");
      }
    } catch (error) {
      showNotification("error", "Erreur réseau lors du changement de mot de passe...");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="content flex-grow-1 p-4">
      <div className="row justify-content-center">
        <div className="col-12 col-xl-10">
          
          {/* En-tête */}
          <div className="text-center mb-5">
            <h2 className="fw-bold text-dark mb-2">Mon Profil</h2>
            <p className="text-muted fs-5">Gérez vos informations personnelles</p>
          </div>

          {/* Notification */}
          {message && (
            <div
              className={`alert ${
                message.type === "success" ? "alert-success" : "alert-danger"
              } alert-dismissible fade show mb-5 border-0`}
              role="alert"
              style={{ 
                borderRadius: '12px',
                backgroundColor: message.type === "success" ? '#f0f9ff' : '#fef2f2'
              }}
            >
              <div className="d-flex align-items-center">
                <span className="flex-grow-1">{message.text}</span>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setMessage(null)}
                ></button>
              </div>
            </div>
          )}

          <div className="row g-5">
            {/* Section Informations Générales */}
            <div className="col-lg-6">
              <div className="card border-0 shadow-lg h-100">
                <div className="card-body p-5">
                  <div className="text-center mb-5">
                    <h4 className="card-title fw-bold mb-3">Informations Personnelles</h4>
                    <p className="text-muted fs-6">Mettez à jour vos coordonnées</p>
                  </div>
                  
                  <form onSubmit={handleProfileUpdate}>
                    <div className="mb-4">
                      <label className="form-label fw-semibold text-dark fs-6">Nom</label>
                      <input
                        type="text"
                        className="form-control border-1 rounded-3 py-3 px-4 fs-6"
                        value={teacher.name}
                        onChange={(e) => setTeacher({ ...teacher, name: e.target.value })}
                        required
                        style={{ borderColor: '#e2e8f0' }}
                      />
                    </div>

                    <div className="mb-4">
                      <label className="form-label fw-semibold text-dark fs-6">Prénom</label>
                      <input
                        type="text"
                        className="form-control border-1 rounded-3 py-3 px-4 fs-6"
                        value={teacher.surname}
                        onChange={(e) => setTeacher({ ...teacher, surname: e.target.value })}
                        required
                        style={{ borderColor: '#e2e8f0' }}
                      />
                    </div>

                    <div className="mb-5">
                      <label className="form-label fw-semibold text-dark fs-6">Téléphone</label>
                      <input
                        type="tel"
                        className="form-control border-1 rounded-3 py-3 px-4 fs-6"
                        value={teacher.phone}
                        onChange={(e) => setTeacher({ ...teacher, phone: e.target.value })}
                        placeholder="+33 1 23 45 67 89"
                        style={{ borderColor: '#e2e8f0' }}
                      />
                    </div>

                    <button 
                      className="btn btn-primary w-100 py-3 rounded-3 fw-semibold fs-6"
                      type="submit"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Mise à jour...
                        </>
                      ) : (
                        'Enregistrer les modifications'
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {/* Section Mot de Passe */}
            <div className="col-lg-6">
              <div className="card border-0 shadow-lg h-100">
                <div className="card-body p-5">
                  <div className="text-center mb-5">
                    <h4 className="card-title fw-bold mb-3">Sécurité</h4>
                    <p className="text-muted fs-6">Modifiez votre mot de passe</p>
                  </div>
                  
                  <form onSubmit={handlePasswordChange}>
                    <div className="mb-4">
                      <label className="form-label fw-semibold text-dark fs-6">Mot de passe actuel</label>
                      <input
                        type="password"
                        className="form-control border-1 rounded-3 py-3 px-4 fs-6"
                        value={teacher.currentPassword}
                        onChange={(e) => setTeacher({ ...teacher, currentPassword: e.target.value })}
                        placeholder="••••••••"
                        required
                        style={{ borderColor: '#e2e8f0' }}
                      />
                    </div>

                    <div className="mb-4">
                      <label className="form-label fw-semibold text-dark fs-6">Nouveau mot de passe</label>
                      <input
                        type="password"
                        className="form-control border-1 rounded-3 py-3 px-4 fs-6"
                        value={teacher.newPassword}
                        onChange={(e) => setTeacher({ ...teacher, newPassword: e.target.value })}
                        placeholder="Au moins 6 caractères"
                        required
                        minLength={6}
                        style={{ borderColor: '#e2e8f0' }}
                      />
                    </div>

                    <div className="mb-5">
                      <label className="form-label fw-semibold text-dark fs-6">Confirmer le mot de passe</label>
                      <input
                        type="password"
                        className="form-control border-1 rounded-3 py-3 px-4 fs-6"
                        value={teacher.confirmPassword}
                        onChange={(e) => setTeacher({ ...teacher, confirmPassword: e.target.value })}
                        placeholder="Confirmez votre mot de passe"
                        required
                        style={{ borderColor: '#e2e8f0' }}
                      />
                    </div>

                    <button 
                      className="btn btn-primary w-100 py-3 rounded-3 fw-semibold fs-6"
                      type="submit"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Modification...
                        </>
                      ) : (
                        'Changer le mot de passe'
                      )}
                    </button>

                    <div className="mt-4 text-center">
                      <small className="text-muted fs-6">
                        Utilisez un mot de passe fort pour plus de sécurité
                      </small>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}