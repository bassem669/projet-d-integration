module.exports = (requiredRoles = []) => {
  return (req, res, next) => {
    try {
      const user = req.user; 

      if (!user || !user.role) {
        return res.status(403).json({ message: "Accès refusé : rôle manquant" });
      }

      if (!requiredRoles.includes(user.role)) {
        return res.status(403).json({ message: "Accès refusé : rôle insuffisant" });
      }

      next();
    } catch (err) {
      return res.status(500).json({ message: "Erreur middleware RBAC" });
    }
  };
};
