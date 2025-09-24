const express = require("express")
const { register, login } = require('../controllers/authController.js')
const { authenticate, authorize } = require('../middlewares/auth.js')

const router = express.Router()

router.post('/register', register);
router.post('/login', login);


// Añadir rutas protegidas (subir facturas)


module.exports = router;