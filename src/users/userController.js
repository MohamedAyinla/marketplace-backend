const User = require("./userModel");
const {
  hashPassword,
  verifyPassword,
  generateToken,
  isValidToken,
  refreshToken,
} = require("../utils/utils.js");

/**
 * Inscription d'un nouvel utilisateur.
 */
async function register(req, res) {
  const { username, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Utilisateur déjà existant" });
    }

    const salt = Date.now().toString();
    const hashedPassword = hashPassword(password, salt);

    const user = new User({ username, password: hashedPassword, salt });
    await user.save();

    res
      .status(201)
      .json({ message: "Inscription réussie", user: { username } });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
}

/**
 * Connexion d'un utilisateur existant.
 */
async function login(req, res) {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    if (!verifyPassword(password, user.password, user.salt)) {
      return res.status(401).json({ message: "Mot de passe incorrect" });
    }

    const tokenObj = generateToken(user.password);
    res.status(200).json({ message: "Connexion réussie", token: tokenObj });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
}

/**
 * Rafraîchissement du token.
 */
function refresh(req, res) {
  const { token, hash } = req.body;

  const tokenObj = JSON.parse(token);
  if (!isValidToken(tokenObj)) {
    return res.status(401).json({ message: "Token invalide ou expiré" });
  }

  const newToken = refreshToken(hash);
  res.status(200).json({ message: "Token rafraîchi", token: newToken });
}

/**
 * Accès à une route protégée.
 */
function protectedRoute(req, res) {
  res.status(200).json({ message: "Accès autorisé", user: req.user });
}

module.exports = {
  register,
  login,
  refresh,
  protectedRoute,
};
