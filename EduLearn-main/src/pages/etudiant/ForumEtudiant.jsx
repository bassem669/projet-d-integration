import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FaComments, FaPaperPlane, FaSpinner, FaUserAlt } from "react-icons/fa";
import Navbar from "../Navbar";
import MenuEtudiant from "./MenuEtudiant";
import "bootstrap/dist/css/bootstrap.min.css";
import "./TeacherDashboard.css";
import { getAuthHeaders } from "../../services/apiConfig";


export default function ForumEtudiant() {
  // Vérifier si l'utilisateur est connecté
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const forumService = {
    async getAllMessages() {
      return axios.get("http://localhost:5000/api/forum/messages", {
        headers: getAuthHeaders()
      });
    },
    async createMessage(contenu) {
      return axios.post(
        "http://localhost:5000/api/forum/messages",
        { contenu, idUtilisateur: user.idUtilisateur },
        { headers: getAuthHeaders() }
      );
    },
  };

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [error, setError] = useState("");

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!user) return; // Ne pas charger si pas connecté
    fetchMessages();
  }, []);

  // Scroll automatique vers le bas
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await forumService.getAllMessages();
      if (response.data && response.data.messages) {
        setMessages(response.data.messages);
      }
    } catch (err) {
      setError("Erreur de chargement du forum");
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await forumService.createMessage(newMessage);
      setNewMessage("");
      fetchMessages();
    } catch (err) {
      setError("Impossible d'envoyer le message");
    }
  };

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="content px-4 py-5 text-center">
          <p className="text-danger fs-5">
            Vous devez être connecté pour accéder au forum.
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="dashboard d-flex">
        <MenuEtudiant />

        <div className="content flex-grow-1 px-4 py-4">
          {loading ? (
            <div className="text-center py-5">
              <FaSpinner className="fa-spin text-primary" size="2em" />
              <p>Chargement du forum...</p>
            </div>
          ) : (
            <>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="d-flex align-items-center">
                  <FaComments className="me-2 text-primary" /> Forum – Réponses
                </h4>
                <span className="text-muted small">{messages.length} messages</span>
              </div>

              {error && <div className="alert alert-danger">{error}</div>}

              {/* LISTE DES MESSAGES */}
              <div className="card shadow-sm mb-4">
                <div className="card-header bg-primary text-white">Questions des étudiants</div>
                <div
                  className="card-body overflow-auto"
                  style={{ maxHeight: "500px", scrollBehavior: "smooth" }}
                >
                  {messages.length === 0 ? (
                    <div className="text-center py-5">
                      <div
                        className="d-inline-flex align-items-center justify-content-center bg-light rounded-circle mb-3"
                        style={{ width: "80px", height: "80px" }}
                      >
                        <FaComments size="2.5em" className="text-primary" />
                      </div>
                      <p className="text-muted fs-5">Aucune question pour le moment</p>
                      <p className="text-muted small">
                        Les questions des étudiants apparaîtront ici dès qu’elles seront postées.
                      </p>
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <div
                        key={msg.idMessage}
                        className="p-3 mb-3 rounded shadow-sm"
                        style={{ backgroundColor: "#f8f9fa" }}
                      >
                        <div className="d-flex align-items-center mb-2">
                          <FaUserAlt className="text-primary me-2" />
                          <strong>{msg.nom} {msg.prenom}</strong>
                          <span className="ms-auto text-muted small">
                            {msg.created_at ? new Date(msg.created_at).toLocaleString() : ""}
                          </span>
                        </div>
                        <p className="mb-0">{msg.contenu}</p>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef}></div>
                </div>
              </div>

              {/* FORMULAIRE D'ENVOI */}
              <div className="card shadow-sm">
                <div className="card-header bg-secondary text-white">Répondre au forum</div>
                <div className="card-body">
                  <form onSubmit={handleSendMessage}>
                    <textarea
                      className="form-control mb-3 border-0 shadow-sm"
                      placeholder="Écrire une question ou un commentaire..."
                      rows="3"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      style={{ resize: "none", borderRadius: "0.5rem" }}
                    />
                    <button className="btn btn-primary w-100 d-flex align-items-center justify-content-center">
                      <FaPaperPlane className="me-2" /> Envoyer
                    </button>
                  </form>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
