/*APPELS*/
const express = require('express'); /*Appelle Express*/
const router = express.Router(); /*Crée un routeur via Express*/
const userCtrl = require('../controllers/user'); /*Appelle le contrôleur "User"*/


/*ROUTES*/
router.post('/signup', userCtrl.signup); /*Crée une route POST vers "/signup" d'après le contrôleur "User.signup"*/
router.post('/login', userCtrl.login); /*Crée une route POST vers "/login" d'après le contrôleur "User.login"*/


/*EXPORT*/
module.exports = router; /*Exporte le routeur "User"*/