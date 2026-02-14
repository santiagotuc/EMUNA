const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

module.exports = (req, res, next) => {
  // 1. Buscar el token en el encabezado de la petición
  const token = req.header("x-auth-token");

  // 2. Si no hay token, denegar acceso
  if (!token) {
    return res.status(401).json({ message: "No hay token, permiso denegado" });
  }

  // 3. Verificar si el token es válido
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Guardamos los datos del usuario en la petición
    next(); // Continuar a la siguiente función
  } catch (error) {
    res.status(401).json({ message: "Token no válido" });
  }
};
