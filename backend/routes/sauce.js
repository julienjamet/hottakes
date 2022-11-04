/*APPELS*/
const express = require('express'); /*Appelle Express*/
const router = express.Router(); /*Crée un routeur via Express*/
const sauceCtrl = require('../controllers/sauce'); /*Appelle le contrôleur "Sauce"*/
const auth = require('../middleware/auth'); /*Appelle la fonction d'authentification*/
const multer = require('../middleware/multer-config'); /*Appelle le multer*/


/*ROUTES*/
router.post('/', auth, multer, sauceCtrl.postNewSauce); /*Crée une route POST vers "/" d'après le contrôleur "Sauce.postNewSauce" sous réserve d'authentification et qui utilise le multer*/
router.get('/', auth, sauceCtrl.getAllSauces); /*Crée une route GET vers "/" d'après le contrôleur "Sauce.getAllSauces" sous réserve d'authentification*/
router.get('/:id', auth, sauceCtrl.getOneSauce); /*Crée une route GET vers "/:id" d'après le contrôleur "Sauce.getOneSauce" sous réserve d'authentification*/
router.put('/:id', auth, multer, sauceCtrl.modifySauce); /*Crée une route PUT vers "/:id" d'après le contrôleur "Sauce.modifySauce" sous réserve d'authentification et qui utilise le multer*/
router.delete('/:id', auth, sauceCtrl.deleteSauce); /*Crée une route DELETE vers "/:id" d'après le contrôleur "Sauce.deleteSauce" sous réserve d'authentification*/
router.post('/:id/like', auth, sauceCtrl.likeSauce); /*Crée une route POST vers "/:id/like" d'après le contrôleur "Sauce.likeSauce" sous réserve d'authentification*/


/*EXPORT*/
module.exports = router; /*Exporte le routeur "Sauce"*/