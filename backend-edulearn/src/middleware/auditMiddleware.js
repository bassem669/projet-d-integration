const connection = require("../config/db");

function auditMiddleware(action) {
  return (req, res, next) => {
    try {
      const adminId = req.user ? req.user.idUtilisateur : null;

      const sql = `
        INSERT INTO audit_logs (adminId, action, method, route, ip)
        VALUES (?, ?, ?, ?, ?)
      `;
      const params = [
        adminId,
        action,
        req.method,
        req.originalUrl,
        req.ip
      ];

      connection.query(sql, params, (err) => {
        if (err) {
          console.error("Erreur Audit Log:", err);
          // On ne bloque pas la requête principale, juste log l'erreur
        }
      });
    } catch (err) {
      console.error("Erreur auditMiddleware:", err);
    }

    next(); // Toujours appeler next() pour continuer le flux
  };
}

module.exports = auditMiddleware;
