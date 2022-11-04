/*APPELS*/
const mongoose = require('mongoose'); /*Appelle Mongoose*/
const mongoErrors = require('mongoose-mongodb-errors'); /*Appelle le plugin "Erreurs MongoDB" de Mongoose*/


/*SCHEMA*/
const sauceSchema = mongoose.Schema({ /*Utilise la méthode "Schéma" de Mongoose pour créer le schéma "Sauce"*/
    userId: { type: String, required: true },
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    mainPepper: { type: String, required: true },
    heat: { type: Number, required: true },
    likes: { type: Number, required: false, },
    dislikes: { type: Number, required: false },
    usersLiked: { type: ["String <userId>"], required: false },
    usersDisliked: { type: ["String <userId>"], required: false }
});
sauceSchema.plugin(mongoErrors); /*Applique le plugin "Erreurs MongoDB" de Mongoose au schéma "Sauce"*/


/*EXPORT*/
module.exports = mongoose.model('Sauce', sauceSchema); /*Exporte le schéma "Sauce"*/