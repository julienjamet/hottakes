/*APPELS*/
const bcrypt = require('bcrypt'); /*Appelle Bcrypt*/
const jwt = require('jsonwebtoken'); /*Appelle JsonWebToken*/
const User = require('../models/user'); /*Appelle le schéma "User"*/


/*CONTRÔLEURS*/
exports.signup = (req, res) => { /*Crée et exporte le contrôleur "User.signup"*/
    if (/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/.test(req.body.email) && /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/.test(req.body.password)) {
        bcrypt.hash(req.body.password, 10) /*Utilise la méthode "Hash" de Bcrypt pour crypter le mot de passe renseigné...*/
            .then(hash => {
                const user = new User ({ /*...puis crée un utilisateur selon le schéma "User"...*/
                    email: req.body.email, /*...dont l'email sera celui renseigné...*/
                    password: hash /*...et le mot de passe le résultat du hash*/
                });
                user.save() /*Sauvegarde le nouvel utilisateur sur MongoDB*/
                    .then(() => res.status(201).json({ message: `L'utilisateur ${req.body.email} a été créé !` }))
                    .catch(error => res.status(400).json({ error }));
            })
            .catch(error => res.status(500).json({ error }));
    }
    else {
        console.log("Veuillez entrer une adresse mail valide et un mot de passe d'au moins 8 caractères comprenant au moins une majuscule, une minuscule, une chiffre et un caractère spécial")
        res.status(400).json({ message: "Veuillez entrer une adresse mail valide et un mot de passe d'au moins 8 caractères comprenant au moins une majuscule, une minuscule, un chiffre et un caractère spécial" })
    } 
};
/*-------------------------------------------------------------------------------------------------------------------*/
exports.login = (req, res, next) => { /*Crée et exporte le contrôleur "User.login"*/
    User.findOne({email: req.body.email}) /*Utilise la fonction "FindOne" pour chercher dans la base de données l'email renseigné*/
        .then(user => {
            if (user === null) { /*Si l'email n'est pas trouvé...*/
                res.status(401).json({ message: `Le compte ${req.body.email} n'existe pas !` }); /*...renvoie un message d'erreur*/
            }
            else { /*Si l'email est trouvé...*/
                bcrypt.compare(req.body.password, user.password) /*...utilise la méthode "Compare" de Bcrypt pour comparer le mot de passe renseigné à celui associé à l'utilisateur*/
                    .then(valid => {
                        if(!valid) { /*Si le mot de passe est invalide...*/
                            res.status(401).json({ message: 'Le mot de passe est incorrect !' }); /*...renvoie un message d'erreur*/
                        }
                        else { /*Si le mot de passe est valide...*/
                            res.status(200).json({ /*...renvoie un objet "user"...*/
                                userId: user._id, /*...qui contient l'identifiant unique de l'utilisateur...*/
                                token: jwt.sign( /*...et un token encodant...*/
                                    { userId: user._id }, /*...cet identifiant unique...*/
                                    'RANDOM_TOKEN_SECRET', /*...grâce à une clé secrète générée aléatoirement...*/
                                    { expiresIn: '1h' } /*...et valable une heure*/
                                )
                            });
                        }
                    })
                    .catch(error => {
                        res.status(500).json({ error });
                    })
            }
        })
        .catch(error => {
            res.status(500).json({ error });
        })
}