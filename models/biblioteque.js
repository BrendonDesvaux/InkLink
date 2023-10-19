const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bibliotequeSchema = new Schema({
    // L'identifiant "_id" sera généré automatiquement par MongoDB
    titre: { type: String, required: true },
    categorie: { type: String },
    livres: [{ type: Schema.Types.ObjectId, ref: 'Livre' }],
});

const Biblioteque = mongoose.model('Biblioteque', bibliotequeSchema);

// Méthode pour créer une nouvelle bibliothèque
Biblioteque.createBiblioteque = async function(data) {
    return await this.create(data);
};

// Méthode pour récupérer toutes les bibliothèques
Biblioteque.getAllBiblioteques = async function() {
    return await this.find({});
};

// Méthode pour récupérer une bibliothèque par son ID
Biblioteque.getBibliotequeById = async function(bibliotequeId) {
    return await this.findById(bibliotequeId);
};

// Méthode pour mettre à jour une bibliothèque par son ID
Biblioteque.updateBibliotequeById = async function(bibliotequeId, data) {
    return await this.findByIdAndUpdate(bibliotequeId, data, { new: true });
};

// Méthode pour supprimer une bibliothèque par son ID
Biblioteque.deleteBibliotequeById = async function(bibliotequeId) {
    return await this.findByIdAndDelete(bibliotequeId);
};

module.exports = Biblioteque;