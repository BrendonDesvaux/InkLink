const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const livreSchema = new Schema({
    // L'identifiant "_id" sera généré automatiquement par MongoDB
    titre: { type: String, required: true },
    genre: { type: String },
    auteur: { type: String },
    cover: { type: String },
    bacolor: { type: String },
    resume: { type: String },
    histoire: { type: String },
    description: { type: String },
}, { collection: 'livre' });

const Livre = mongoose.model('Livre', livreSchema);

// Méthode pour créer un nouveau livre
Livre.createLivre = async function(data) {
    return await this.create(data);
};

// Méthode pour récupérer tous les livres
Livre.getAllLivres = async function() {
    return await this.find({});
};

// Méthode pour récupérer un livre par son ID
Livre.getLivreById = async function(livreId) {
    return await this.findById(livreId);
};

// Méthode pour mettre à jour un livre par son ID
Livre.updateLivreById = async function(livreId, data) {
    return await this.findByIdAndUpdate(livreId, data, { new: true });
};

// Méthode pour supprimer un livre par son ID
Livre.deleteLivreById = async function(livreId) {
    return await this.findByIdAndDelete(livreId);
};

Livre.getLivreByGenre = async function(genre) {
    return await this.find({ genre: genre });
}


module.exports = Livre;