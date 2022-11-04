/*APPELS*/
const multer = require('multer'); /*Appelle Multer*/
const MIME_TYPES = { /*Crée un dictionnaire de type MIME*/
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
}


/*MULTER*/
const storage = multer.diskStorage({ /*Utilise la méthode "DiskStorage" de Multer pour créer et enregistrer sur le serveur un fichier...*/ 
    destination: (req, file, callback) => {
        callback(null, 'images') /*...dont la destination sera le dossier "images"*/
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_'); /*La première partie du nom du fichier stocké sera définie par son nom d'origine, mais les éventuels espaces seront remplacés par des underscores pour éviter les bugs*/
        const extension = MIME_TYPES[file.mimetype]; /*L'extension du fichier stocké sera définie grâce au dictionnaire de type MIME*/
        callback(null, name + Date.now() + '.' + extension); /*Le nom complet du fichier stocké sera ensuite obtenu par concaténation des variables*/
    }
});


/*EXPORT*/
module.exports = multer({ storage }).single('image'); /*Exporte le multer, qui ciblera uniquement les fichiers image*/