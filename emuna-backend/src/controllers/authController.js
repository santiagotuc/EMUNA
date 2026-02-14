const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// CLAVE SECRETA (En un proyecto real, esto va en el archivo .env)
const JWT_SECRET = "palabra_super_secreta_de_emuna";

// @desc Registrar un nuevo usuario (Solo lo usaremos una vez para crear al admin)
// @route POST /api/auth/register
exports.register = async (req, res) => {
  const { username, password } = req.body;

  try {
    // 1. Encriptar la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 2. Crear el usuario
    const newUser = new User({
      username,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: "Usuario administrador creado con éxito" });
  } catch (error) {
    res.status(500).json({ message: "Error al crear usuario", error });
  }
};

// @desc Iniciar Sesión
// @route POST /api/auth/login
exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // 1. Buscar si el usuario existe
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Usuario no encontrado" });
    }

    // 2. Verificar si la contraseña coincide
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Contraseña incorrecta" });
    }

    // 3. Generar el Token (El carnet de acceso)
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1d" }); // Expira en 1 día

    res.json({ token, username: user.username });
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor", error });
  }
};
