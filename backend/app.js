/*APPELS*/
const express = require('express'); /*Appelle Express*/
const helmet = require('helmet'); /*Appelle Helmet*/
const app = express(); /*Crée une application via Express*/
const path = require('path'); /*Appelle Path*/
require('dotenv').config(); /*Appelle DotEnv*/
/*-------------------------------------------------------------------------------------------------------------------*/
const mongoose = require('mongoose'); /*Appelle Mongoose*/
mongoose.connect(process.env.DATABASE_CREDENTIALS, /*Utilise DotEnv pour ne pas afficher les informations sensibles*/
{ useNewUrlParser: true,
  useUnifiedTopology: true }) /*Utilise la méthode "Connect" de Mongoose pour connecter l'application à MongoDB*/
  .then(() => console.log('Connected to MongoDB'))
  .catch(() => console.log('Failed to connect to MongoDB'));
/*-------------------------------------------------------------------------------------------------------------------*/
const userRoutes = require('./routes/user'); /*Appelle le routeur "User"*/
const sauceRoutes = require('./routes/sauce'); /*Appelle le routeur "Sauce"*/


/*UTILISATION*/
app.use(helmet({ crossOriginResourcePolicy: false })) /*Utilise Helmet pour protéger l'application des attaques courantes*/
/*-------------------------------------------------------------------------------------------------------------------*/
app.use((req, res, next) => { /*Autorise tous les accès vers l'application*/
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    next();
});
/*-------------------------------------------------------------------------------------------------------------------*/
app.use(express.json()); /*Parse les requêtes entrantes puis place le résultat du parse dans le req.body*/
/*-------------------------------------------------------------------------------------------------------------------*/
app.use('/api/auth', userRoutes); /*Utilise le routeur "User" sur "/api/auth"*/
app.use('/api/sauces', sauceRoutes); /*Utilise le routeur "Sauce" sur "/api/sauces"*/
app.use('/images', express.static(path.join(__dirname, 'images'))); /*Indique à l'application le chemin d'accès aux fichiers image*/


/*EXPORT*/
module.exports = app; /*Exporte l'application*/
