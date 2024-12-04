function hashPassword(password, salt = "default_salt") {
  let hash = 0;
  const saltedPassword = password + salt;
  for (let i = 0; i < saltedPassword.length; i++) {
    const char = saltedPassword.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16);
}

function verifyPassword(password, hash, salt = "default_salt") {
  return hashPassword(password, salt) === hash;
}

function generateToken(hash) {
  let token = hash;
  let counter = 0;
  while (!token.includes("000")) {
    counter++;
    token = hashPassword(hash + counter);
  }
  const expiration = Date.now() + 60 * 60 * 1000;
  return { token, expiration };
}

function isValidToken(tokenObj) {
  const { token, expiration } = tokenObj;
  return Date.now() < expiration && token.includes("000");
}

function refreshToken(hash) {
  return generateToken(hash);
}

module.exports = {
  hashPassword,
  verifyPassword,
  generateToken,
  isValidToken,
  refreshToken,
};
