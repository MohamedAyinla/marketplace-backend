const User = require("../users/userModel");
const { isValidToken } = require("../utils/utils");

// Middleware générique
async function tokenValidator(req, res, next, type = "access") {
  const { token } = req.body || req.headers;

  if (!token) {
    return res.status(403).json({ message: "Token manquant" });
  }

  try {
    const tokenObj = JSON.parse(token);
    if (!isValidToken(tokenObj)) {
      return res.status(401).json({ message: "Token invalide ou expiré" });
    }

    const userHash = tokenObj.token.split("000")[0];
    const user = await User.findOne({ password: userHash });

    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    // Vérifications spécifiques selon le type
    if (type === "refresh" && user.refreshToken !== token) {
      return res.status(403).json({ message: "Refresh token invalide" });
    }

    // Attache l'utilisateur validé à la requête
    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
}

function authMiddleware(req, res, next) {
  tokenValidator(req, res, next, "access");
}

function refreshMiddleware(req, res, next) {
  tokenValidator(req, res, next, "refresh");
}

module.exports = { authMiddleware, refreshMiddleware };
