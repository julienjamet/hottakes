/*APPELS*/
const mongoose = require('mongoose'); /*Appelle Mongoose*/
const mongoErrors = require('mongoose-mongodb-errors'); /*Appelle le plugin "Erreurs MongoDB" de Mongoose*/
const uniqueValidator = require('mongoose-unique-validator'); /*Appelle le plugin "Validateur unique" de Mongoose*/


/*SCHEMA*/
const userSchema = mongoose.Schema({ /*Utilise la méthode "Schéma" de Mongoose pour créer le schéma "User"*/
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});
userSchema.plugin(mongoErrors); /*Applique le plugin "Erreurs MongoDB" de Mongoose au schéma "User"*/
userSchema.plugin(uniqueValidator); /*Applique le plugin "Validateur unique" de Mongoose au schéma "User"*/


/*EXPORT*/
module.exports = mongoose.model('User', userSchema); /*Exporte le schéma "User"*/