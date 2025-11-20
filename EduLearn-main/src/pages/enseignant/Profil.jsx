import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./TeacherDashboard.css";

export default function Profil() {
  const [teacher, setTeacher] = useState({
    name: "",
    surname: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState(null);

  // ================================
  // 🔹 Notification simple
  // ================================
  const showNotification = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
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
        Authorization: `Bearer ${token}`, // 🔥 Envoi automatique du token
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setTeacher({
          name: data.nom || "",
          surname: data.prenom || "",
          email: data.email || "",
          phone: data.phone || "",
          password: "",
          confirmPassword: "",
        });
      })
      .catch(() => {
        showNotification("error", "Erreur lors du chargement du profil...");
      });
  }, []); // ← Ne pas ajouter teacher ici sinon boucle infinie

  // ================================
  // 🔹 Mettre à jour le profil
  // ================================
  const handleProfileUpdate = (e) => {
    e.preventDefault();

    if (teacher.password && teacher.password !== teacher.confirmPassword) {
      showNotification("error", "Les mots de passe ne correspondent pas.");
      return;
    }

    const updatedData = {
      nom: teacher.name,
      prenom: teacher.surname,
      email: teacher.email,
      phone: teacher.phone,
    };

    if (teacher.password) {
      updatedData.password = teacher.password; // 🔥 envoi uniquement si modifié
    }

    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/api/profil", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // 🔥 token dans PUT
      },
      body: JSON.stringify(updatedData),
    })
      .then((res) => res.json())
      .then(() => {
        showNotification("success", "Profil mis à jour avec succès !");
      })
      .catch(() => {
        showNotification("error", "Erreur lors de la mise à jour du profil...");
      });
  };

  return (
    <div className="content flex-grow-1 px-4">
      <div className="row justify-content-center">
        <div className="col-md-10 col-lg-8 col-xl-7">
          <div className="card-modern p-5 mt-4">
            <h4 className="text-center mb-4">Mon profil</h4>

            {message && (
              <div
                className={`alert ${
                  message.type === "success" ? "alert-success" : "alert-danger"
                }`}
              >
                {message.text}
              </div>
            )}

            <form onSubmit={handleProfileUpdate}>
              <h5 className="text-center mb-4">Changer les informations générales</h5>

              <div className="form-group mb-3">
                <label>Nom</label>
                <input
                  type="text"
                  className="form-control"
                  value={teacher.name}
                  onChange={(e) => setTeacher({ ...teacher, name: e.target.value })}
                />
              </div>

              <div className="form-group mb-3">
                <label>Prénom</label>
                <input
                  type="text"
                  className="form-control"
                  value={teacher.surname}
                  onChange={(e) =>
                    setTeacher({ ...teacher, surname: e.target.value })
                  }
                />
              </div>

              <div className="form-group mb-3">
                <label>Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={teacher.email}
                  onChange={(e) => setTeacher({ ...teacher, email: e.target.value })}
                />
              </div>

              <div className="form-group mb-3">
                <label>Téléphone</label>
                <input
                  type="tel"
                  className="form-control"
                  value={teacher.phone}
                  onChange={(e) =>
                    setTeacher({ ...teacher, phone: e.target.value })
                  }
                />
              </div>

              <hr />

              <h5 className="text-center mb-4">Changer le mot de passe</h5>

              <div className="form-group mb-3">
                <label>Nouveau mot de passe</label>
                <input
                  type="password"
                  className="form-control"
                  value={teacher.password}
                  onChange={(e) =>
                    setTeacher({ ...teacher, password: e.target.value })
                  }
                />
              </div>

              <div className="form-group mb-4">
                <label>Confirmer le mot de passe</label>
                <input
                  type="password"
                  className="form-control"
                  value={teacher.confirmPassword}
                  onChange={(e) =>
                    setTeacher({
                      ...teacher,
                      confirmPassword: e.target.value,
                    })
                  }
                />
              </div>

              <div className="d-flex justify-content-center">
                <button className="btn btn-primary px-4 py-2" type="submit">
                  Enregistrer les modifications
                </button>
              </div>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
}
