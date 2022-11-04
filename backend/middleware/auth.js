/*APPELS*/
const jwt = require('jsonwebtoken'); /*Appelle JsonWebToken*/

/*EXPORT*/
module.exports = (req, res, next) => { /*Exporte une fonction...*/
    try {
        const token = req.headers.authorization.split(' ')[1]; /*...qui récupère le token crypté dans l'en-tête "Autorisation" de chaque requête...*/
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET'); /*...puis le décrypte grâce à la méthode "Vérifier" de JsonWebToken...*/
        const userId = decodedToken.userId; /*...afin d'en extraire l'identifiant unique de l'utilisateur...*/
        req.auth = { userId: userId }; /*...qui est finalement réintégré à la requête comme clé d'authentification*/
        next();
    }
    catch(error) {
        res.status(401).json({ error });
    }
};