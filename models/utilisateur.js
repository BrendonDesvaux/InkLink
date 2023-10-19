const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    // L'identifiant "_id" sera généré automatiquement par MongoDB
    pn: { type: String },
    idCo: { type: String },
    nom: { type: String },
    prenom: { type: String },
    mail: { type: String, required: true },
    mailContact: { type: String },
    description: { type: String },
    ville: { type: String },
    dob: { type: String },
    website: { type: String },
    bibliotheques: [{ type: Schema.Types.ObjectId, ref: 'Biblioteque' }],
}, { collection: 'User' });

const User = mongoose.model('User', UserSchema);

// Méthode pour créer un nouvel User
User.createUser = async function(data) {
    return await this.create(data);
};

// Méthode pour récupérer tous les Users
User.getAllUsers = async function() {
    return await this.find({});
};

// Méthode pour récupérer un User par son ID
User.getUserById = async function(UserId) {
    return await this.findById(UserId);
};

// Méthode pour mettre à jour un User par son ID
User.updateUserById = async function(UserId, data) {
    return await this.findByIdAndUpdate(UserId, data, { new: true });
};

// Méthode pour supprimer un User par son ID
User.deleteUserById = async function(UserId) {
    return await this.findByIdAndDelete(UserId);
};

// Méthode pour ajouter un livre à une bibliothèque de l'User
User.ajouterLivreDansBibliotheque = async function(UserId, bibliothèqueId, livreId) {
    const User = await this.findById(UserId);
    if (!User) {
        throw new Error('User non trouvé');
    }

    const bibliothèque = User.bibliotheques.find(b => b._id.equals(bibliothèqueId));
    if (!bibliothèque) {
        throw new Error('Bibliothèque non trouvée pour cet User');
    }

    bibliothèque.livres.push(livreId);
    return await User.save();
};

// Méthode pour supprimer un livre d'une bibliothèque de l'User
User.supprimerLivreDeBibliotheque = async function(UserId, bibliothèqueId, livreId) {
    const User = await this.findById(UserId);
    if (!User) {
        throw new Error('User non trouvé');
    }

    const bibliothèque = User.bibliotheques.find(b => b._id.equals(bibliothèqueId));
    if (!bibliothèque) {
        throw new Error('Bibliothèque non trouvée pour cet User');
    }

    const index = bibliothèque.livres.indexOf(livreId);
    if (index !== -1) {
        bibliothèque.livres.splice(index, 1);
        return await User.save();
    } else {
        throw new Error('Livre non trouvé dans cette bibliothèque');
    }
};
module.exports = User;