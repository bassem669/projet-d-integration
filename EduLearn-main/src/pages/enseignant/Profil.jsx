import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./TeacherDashboard.css";

export default function Profil() {
  const [teacher, setTeacher] = useState({
    name: "Ahmed",
    surname: "Ben Salah",
    email: "ahmed.bensalah@example.com",
    phone: "22112233",
    subject: "Mathématiques",
    password: "",
    confirmPassword: "",
    profilePicture: "",
  });

  const [message, setMessage] = useState(null);

  // ✅ Notification simple pour feedback utilisateur
  const showNotification = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleProfileUpdate = (e) => {
    e.preventDefault();

    if (teacher.password && teacher.password !== teacher.confirmPassword) {
      showNotification("error", "Les mots de passe ne correspondent pas.");
      return;
    }

    showNotification("success", "Profil mis à jour avec succès !");
    // 🔹 Ici tu peux faire un appel API pour sauvegarder dans ta base
  };

  return (
    <div className="card-modern p-4 mt-4">
      <h4>Mon profil</h4>

      {message && (
        <div
          className={`alert ${
            message.type === "success" ? "alert-success" : "alert-danger"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="row">
        {/* 📸 Colonne gauche : photo de profil */}
        <div className="col-md-4 text-center mb-4">
          <div
            style={{
              width: "250px",
              height: "300px",
              margin: "0 auto",
              borderRadius: "20px",
              overflow: "hidden",
              border: "4px solid #ff8800",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            }}
          >
            <img
              src={teacher.profilePicture || "https://via.placeholder.com/250x300"}
              alt="Profil"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>
          <div>
            <label
              className="btn mt-3"
              style={{ backgroundColor: "#ff8800", color: "#fff" }}
            >
              Changer la photo
              <input
                type="file"
                hidden
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = () => {
                      setTeacher({ ...teacher, profilePicture: reader.result });
                      showNotification("success", "Photo de profil mise à jour !");
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </label>
          </div>
        </div>

        {/* 🧾 Colonne droite : informations et mot de passe */}
        <div className="col-md-8">
          <h5>Changer les informations générales</h5>
          <form className="form-horizontal" onSubmit={handleProfileUpdate}>
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
                onChange={(e) =>
                  setTeacher({ ...teacher, email: e.target.value })
                }
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

            <div className="form-group mb-3">
              <label>Matière enseignée</label>
              <input
                type="text"
                className="form-control"
                value={teacher.subject}
                onChange={(e) =>
                  setTeacher({ ...teacher, subject: e.target.value })
                }
              />
            </div>

            <hr />

            <h5>Changer le mot de passe</h5>
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
                  setTeacher({ ...teacher, confirmPassword: e.target.value })
                }
              />
            </div>

            <div className="form-group d-flex justify-content-end">
              <button type="submit" className="btn btn-primary">
                Enregistrer les modifications
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
