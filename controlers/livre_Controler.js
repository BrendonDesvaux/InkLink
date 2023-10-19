const Livre = require('../models/livre');
const errorLogger = require('../middlewares/errorLogger'); // Remplacez le chemin par le chemin correct vers votre module de journalisation des erreurs
// Controler pour recuperer tous les livres
exports.getAllLivres = async(req, res) => {
    try {
        const livres = await Livre.getAllLivres();
        //return livre as argument for the view
        res.render('livre', { livres });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des livres' })
    }
};

// Contrôleur pour récupérer un livre par son ID
exports.getLivreById = async(req, res) => {
    const livreId = req.params.id; // L'ID du livre est passé en paramètre dans l'URL
    try {
        const livre = await Livre.getLivreById(livreId);
        if (!livre) {
            return res.status(404).json({ message: 'Livre non trouvé' });
        }
        res.status(200).json(livre);
    } catch (err) {
        res.status(500).json({ message: 'Erreur lors de la récupération du livre' });
    }
};

// Contrôleur pour mettre à jour un livre
exports.updateLivre = async(req, res) => {
    const livreId = req.params.id; // L'ID du livre est passé en paramètre dans l'URL
    const livreData = req.body;
    try {
        const livre = await Livre.updateLivreById(livreId, livreData);
        //console.log(livre.genre);
        if (!livre) {
            return res.status(404).json({ message: 'Livre non trouvé' });
        }
        res.redirect('/livre')
    } catch (err) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour du livre' });
    }
}

// Contrôleur pour supprimer un livre
exports.deleteLivre = async(req, res) => {
    const livreId = req.params.id; // L'ID du livre est passé en paramètre dans l'URL
    try {
        const livre = await Livre.deleteLivreById(livreId);
        if (!livre) {
            return res.status(404).json({ message: 'Livre non trouvé' });
        }
        res.redirect('/livre')
    } catch (err) {
        res.status(500).json({ message: 'Erreur lors de la suppression du livre' });
    }
}
exports.afficherLivreSelection = async(req, res) => {
        const livreId = req.params.id; // L'ID du livre est passé en paramètre dans l'URL
        try {
            const livre = await Livre.getLivreById(livreId);
            if (!livre) {
                return res.status(404).json({ message: 'Livre non trouvé' });
            }
            // Rendez la vue 'modLivre.ejs' en passant l'objet livre en tant que données du modèle
            res.render('lireLivre', { livre });
        } catch (err) {
            res.status(500).json({ message: 'Erreur lors de la récupération du livre' });
        }
    }
    // Contrôleur pour ajouter un livre dans une bibliothèque
exports.ajouterLivreDansBibliotheque = async(req, res) => {
    const livreId = req.params.id; // L'ID du livre est passé en paramètre dans l'URL
    const bibliothèqueId = req.body.bibliothèqueId;
    try {
        const livre = await Livre.ajouterLivreDansBibliotheque(livreId, bibliothèqueId);
        if (!livre) {
            return res.status(404).json({ message: 'Livre non trouvé' });
        }
        res.status(200).json(livre);
    } catch (err) {
        res.status(500).json({ message: 'Erreur lors de l\'ajout du livre dans la bibliothèque' });
    }
}

// Contrôleur pour supprimer un livre d'une bibliothèque
exports.supprimerLivreDeBibliotheque = async(req, res) => {
    const livreId = req.params.id; // L'ID du livre est passé en paramètre dans l'URL
    const bibliothèqueId = req.body.bibliothèqueId;
    try {
        const livre = await Livre.supprimerLivreDeBibliotheque(livreId, bibliothèqueId);
        if (!livre) {
            return res.status(404).json({ message: 'Livre non trouvé' });
        }
        res.status(200).json(livre);
    } catch (err) {
        res.status(500).json({ message: 'Erreur lors de la suppression du livre de la bibliothèque' });
    }
}

// Contrôleur pour traiter l'ajout d'un livre (à appeler lorsque le formulaire est soumis)
exports.ajouterLivre = async(req, res) => {
    // Récupérez les données du formulaire d'ajout de livre (par exemple, via req.body)
    const { titre, description, genre, auteur, cover, bacolor, resume, histoire } = req.body;
    // Créez un nouvel objet Livre avec les données reçues du formulaire
    const nouveauLivre = new Livre({
        titre,
        description,
        genre,
        auteur,
        cover,
        bacolor,
        resume,
        histoire,
    });
    try {
        // Sauvegardez le livre dans la base de données mongoDb
        await nouveauLivre.save();
        console.log(`livre bien rentré sous l'ID ${nouveauLivre.id}`);
    } catch (err) {
        errorLogger.error(`une erreur est survenue: ${err}`);
    }
};

//fonction to display addPage
exports.afficherFormModLivre = async(req, res) => {
    const livreId = req.params.id; // L'ID du livre est passé en paramètre dans l'URL
    try {
        const livre = await Livre.getLivreById(livreId);
        if (!livre) {
            return res.status(404).json({ message: 'Livre non trouvé' });
        }
        // Rendez la vue 'modLivre.ejs' en passant l'objet livre en tant que données du modèle
        res.render('modLivre', { livre });
    } catch (err) {
        res.status(500).json({ message: 'Erreur lors de la récupération du livre' });
    }
};

exports.getLatestLivres = async() => {
    try {
        // Récupérez les derniers livres créés depuis la base de données
        const livres = await Livre.find().sort({ _id: -1 }).limit(10); // Par exemple, récupérez les 10 derniers livres créés

        // Retournez les données des livres
        return livres;
    } catch (err) {
        throw new Error('Erreur lors de la récupération des derniers livres');
    }
};

exports.getLivresByGenre = async(req, res) => {
    try {
        const genre = req.params.genre; // Récupérer le genre à partir des paramètres de la requête
        const livres = await Livre.getLivresByGenre(genre);
        res.render('livre', { livres });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des livres par genre' });
    }
};