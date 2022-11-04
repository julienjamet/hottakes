/*APPELS*/
const fs = require('fs'); /*Appelle FS*/
const Sauce = require('../models/sauce'); /*Appelle le schéma "Sauce"*/


/*CONTRÔLEURS*/
exports.postNewSauce = (req, res, next) => { /*Crée et exporte le contrôleur "Sauce.postNewSauce"*/
    const sauceObject = JSON.parse(req.body.sauce); /*Parse le contenu de la requête pour qu'elle puisse être envoyée par le frontend*/
    delete sauceObject._id; /*Supprime l'identifiant de l'objet parsé car un nouvel identifiant sera automatiquement généré par MongoDB*/
    delete sauceObject._userId; /*Supprime l'identifiant de l'utilisateur de l'objet parsé car il n'est pas authentifié*/
    const sauce = new Sauce({ /*Crée une sauce selon le schéma "Sauce"...*/
        ...sauceObject, /*...constituée des informations renseignées dans le formulaire...*/
        userId: req.auth.userId, /*...et à laquelle on intègre l'identifiant utilisateur authentifié par le token...*/
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`, /*...l'URL complète de l'image...*/
        likes: 0, /*...un nombre de likes initié à 0...*/
        dislikes: 0 /*...et un nombre de dislikes initié à 0*/
    });
    sauce.save() /*Sauvegarde la nouvelle sauce sur MongoDB*/
        .then(() => res.status(201).json({ message: `La sauce ${sauceObject.name} a été créée !` }))
        .catch(error => res.status(400).json({ error }));
};
/*-------------------------------------------------------------------------------------------------------------------*/
exports.getAllSauces = (req, res, next) => { /*Crée et exporte le contrôleur "Sauce.getAllSauces"...*/
    Sauce.find() /*...qui va chercher toutes les sauces qui ont été ajoutées à la base de données...*/
        .then(sauces => res.status(200).json(sauces)) /*...et les renvoie au frontend*/
        .catch(error => res.status(400).json({ error }));
};
/*-------------------------------------------------------------------------------------------------------------------*/
exports.getOneSauce = (req, res, next) => { /*Crée et exporte le contrôleur "Sauce.getOneSauce"...*/
    Sauce.findOne({ _id: req.params.id }) /*...qui récupère la sauce correspondant à l'identifiant présent dans la requête...*/
        .then(sauce => res.status(200).json(sauce)) /*...et la renvoie au frontend*/
        .catch(error => res.status(404).json({ error }));
};
/*-------------------------------------------------------------------------------------------------------------------*/
exports.modifySauce = (req, res, next) => { /*Crée et exporte le contrôleur "Sauce.modifySauce"...*/
    Sauce.findOne({ _id: req.params.id }) /*...qui recherche dans la base de données la sauce correspondant à l'identifiant présent dans la requête*/
        .then(sauce => {
            if (sauce.userId != req.auth.userId) { /*Si l'identifiant du requérant est différent de celui qui a créé la sauce...*/
                res.status(401).json({ message: 'Cette sauce ne vous appartient pas. Vous ne pouvez pas la modifier !' }); /*...l'action n'est pas autorisée*/
            }
            else {
                const sauceObject = req.file ? { /*Dans le cas contraire, le contrôleur construit un objet au contenu variable : si la requête contient un fichier, l'objet variable sera constitué...*/
                    ...JSON.parse(req.body.sauce), /*...du contenu parsé de la requête...*/
                    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`, /*...de l'URL complète du fichier...*/
                    likes: sauce.likes, /*...du nombre de Likes...*/
                    dislikes: sauce.dislikes, /*...et de Dislikes...*/
                    usersLiked: sauce.usersLiked, /*...ainsi que du tableau "UsersLiked"...*/
                    usersDisliked: sauce.usersDisliked /*...et du tableau "UsersDisliked" pour éviter toute manipulation de ces données*/
                } : { /*...sinon, l'objet variable sera constitué...*/
                    ...req.body, /*du contenu de la requête...*/
                    likes: sauce.likes, /*...du nombre de Likes...*/
                    dislikes: sauce.dislikes, /*...et de Dislikes...*/
                    usersLiked: sauce.usersLiked, /*...ainsi que du tableau "UsersLiked"...*/
                    usersDisliked: sauce.usersDisliked /*...et du tableau "UsersDisliked"*/
                };
                Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id }) /*La sauce correspondant à l'identifiant présent dans la requête est ensuite modifiée d'après le contenu de l'objet variable*/
                    .then(() => res.status(200).json({ message: `La sauce ${sauce.name} a été modifiée !` }))
                    .catch(error => res.status(404).json({ error }));
            }
        })
        .catch(error => res.status(404).json({ error }));   
};
/*-------------------------------------------------------------------------------------------------------------------*/
exports.deleteSauce = (req, res, next) => { /*Crée et exporte le contrôleur "Sauce.deleteSauce"...*/
    Sauce.findOne({ _id: req.params.id }) /*...qui recherche dans la base de données la sauce correspondant à l'identifiant présent dans la requête*/
        .then(sauce => {
            if (sauce.userId != req.auth.userId) { /*Si l'identifiant du requérant est différent de celui qui a créé la sauce...*/
                res.status(401).json({ message: 'Cette sauce ne vous appartient pas. Vous ne pouvez pas la supprimer !' }); /*...l'action n'est pas autorisée*/
            }
            else {
                const filename = sauce.imageUrl.split('/images/')[1]; /*Sinon le contrôleur cible dans le dossier images le fichier associé à cette sauce...*/
                fs.unlink(`images/${filename}`, () => { /*...et utilise la méthode "Unlink" de FS pour supprimer ce fichier...*/
                    Sauce.deleteOne({ _id: req.params.id }) /*...avant de supprimer la sauce de la base de données*/
                        .then(() => res.status(200).json({ message: `La sauce ${sauce.name} a été supprimée !` }))
                        .catch(error => res.status(500).json({ error }));
                });
            }
        })
        .catch(error => res.status(404).json({ error }));
};
/*-------------------------------------------------------------------------------------------------------------------*/
exports.likeSauce = (req, res, next) => { /*Crée et exporte le contrôleur "Sauce.likeSauce"*/
    let requestUserId = req.body.userId;
    let likeStatus = req.body.like;
    if (req.body.userId == undefined) {
        res.status(401).json({ message: "Vous ne disposez pas d'un identifiant valide !" })
    }
    if (likeStatus === 1) { /*Si l'utilisateur clique sur le bouton "Like"...*/
        Sauce.findOne({ _id: req.params.id })
            .then(sauce => {
                const usersLiked = sauce.usersLiked;
                const userFoundLike = usersLiked.find(userId => userId == requestUserId); /*...une fonction recherche l'identifiant de l'utilisateur dans le tableau "UsersLiked"...*/
                const usersDisliked = sauce.usersDisliked;
                const userFoundDislike = usersDisliked.find(userId => userId == requestUserId); /*...et une autre dans le tableau "UsersDisliked"...*/
                if (userFoundLike != undefined) { /*Si l'identifiant du requérant est trouvé dans le tableau "UsersLiked"...*/
                    return res.status(401).json({ message: "Vous ne pouvez pas liker une sauce plus d'une fois !" }); /*...l'action n'est pas autorisée*/
                }
                else if (userFoundDislike != undefined) { /*Si l'identifiant du requérant est trouvé dans le tableau "UsersDisliked"...*/
                    return res.status(401).json({ message: "Vous aviez disliké cette sauce...enlevez d'abord le pouce rouge !" }); /*...l'action n'est pas autorisée*/
                }
                else {
                    Sauce.updateOne({ _id: req.params.id }, { $inc:{likes:+1}, $push:{usersLiked:requestUserId} }) /*Si l'identifiant du requérant n'est trouvé dans aucun tableau, le nombre de likes de la sauce est augmenté de 1 dans la base de données, et l'identifiant de l'utilisateur est ajouté au tableau "UsersLiked"*/
                        .then(() => res.status(201).json({ message: 'Vous avez liké la sauce !' }))
                        .catch(error => res.status(400).json({ error }));
                }
            })
            .catch(error => res.status(404).json({ error }));
    }
    else if (likeStatus === -1) { /*Si l'utilisateur clique sur le bouton "Dislike"...*/
        Sauce.findOne({ _id: req.params.id })
            .then(sauce => {
                const usersDisliked = sauce.usersDisliked;
                const userFoundDislike = usersDisliked.find(userId => userId == requestUserId); /*...une fonction recherche l'identifiant de l'utilisateur dans le tableau "UsersDisliked"...*/
                const usersLiked = sauce.usersLiked;
                const userFoundLike = usersLiked.find(userId => userId == requestUserId); /*...et une autre dans le tableau "UsersLiked"*/
                if (userFoundDislike != undefined) { /*Si l'identifiant du requérant est trouvé dans le tableau "UsersDisliked"...*/
                    return res.status(401).json({ message: "Vous ne pouvez pas disliker une sauce plus d'une fois !" }); /*...l'action n'est pas autorisée*/
                }
                else if (userFoundLike != undefined) { /*Si l'identifiant du requérant est trouvé dans le tableau "UsersLiked"...*/
                    return res.status(401).json({ message: "Vous aviez liké cette sauce...enlevez d'abord le pouce vert !" }); /*...l'action n'est pas autorisée*/
                }
                else {
                    Sauce.updateOne({ _id: req.params.id }, { $inc:{dislikes:+1}, $push:{usersDisliked:requestUserId} }) /*Si l'identifiant du requérant n'est trouvé dans aucun tableau, le nombre de dislikes de la sauce est augmenté de 1 dans la base de données, et l'identifiant de l'utilisateur est ajouté au tableau "UsersDisliked"*/
                        .then(() => res.status(201).json({ message: 'Vous avez disliké la sauce !' }))
                        .catch(error => res.status(400).json({ error }));
                }
            })
            .catch(error => res.status(404).json({ error }));
    }
    else if (likeStatus === 0) { /*Si l'utilisateur reclique sur le bouton "Like" ou le bouton "Dislike" pour annuler son choix...*/
        Sauce.findOne({ _id: req.params.id })
            .then(sauce => {
                const usersLiked = sauce.usersLiked;
                const userFoundLike = usersLiked.find(userId => userId == requestUserId); /*...une fonction recherche l'identifiant de l'utilisateur dans le tableau "UsersLiked"*/
                const usersDisliked = sauce.usersDisliked;
                const userFoundDislike = usersDisliked.find(userId => userId == requestUserId); /*...et une autre dans le tableau "UsersDisliked"...*/
                if (userFoundLike != undefined) { /*Si l'identifiant du requérant est trouvé dans le tableau "UsersLiked"...*/
                    Sauce.updateOne({ _id: req.params.id }, {$inc:{likes:-1}, $pull:{usersLiked:requestUserId}}) /*...cela signifie qu'il avait préalablement liké la sauce. Le nombre de likes de la sauce est donc diminué de 1 dans la base de données, et l'identifiant de l'utilisateur est retiré du tableau "UsersLiked"*/
                        .then(() => res.status(201).json({ message: "La sauce n'est plus likée !" }))
                        .catch(error => res.status(400).json({ error }));
                }
                else if (userFoundDislike != undefined) { /*Si l'identifiant du requérant est trouvé dans le tableau "UsersDisliked"...*/
                    Sauce.updateOne({ _id: req.params.id }, {$inc:{dislikes:-1}, $pull:{usersDisliked:requestUserId}}) /*...cela signifie qu'il avait préalablement disliké la sauce. Le nombre de dislikes de la sauce est donc diminué de 1 dans la base de données, et l'identifiant de l'utilisateur est retiré du tableau "UsersDisliked"*/
                        .then(() => res.status(201).json({ message: "La sauce n'est plus dislikée !" }))
                        .catch(error => res.status(400).json({ error }));
                }
                else { /*Si l'identifiant du requérant n'est trouvé dans aucun tableau...*/
                    res.status(400).json({ message: "La sauce n'était ni likée ni dislikée !" }) /*...renvoie un message d'erreur*/
                };
            })
            .catch(error => res.status(404).json({ error }));  
    };
};