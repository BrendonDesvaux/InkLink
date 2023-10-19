const { decrypt } = require('dotenv');
const User = require('../models/utilisateur')
const { encryptData, decryptData } = require('../ecryption');
// Controler pour recuperer tous les utilisateurs
exports.getAllUsers = async(req, res) => {
    try {
        const users = await User.getAllUsers();
        //decrypt users
        users.forEach(user => {
            user.pn = decryptData(user.pn);
            //user.idCo = decryptData(user.idCo)
            user.mail = decryptData(user.mail);
        });
        //return user as argument for the view
        res.render('utilisateur', { users });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs' })
    }
}

// Contrôleur pour récupérer un utilisateur par son ID
exports.getUserById = async(req, res) => {
    const userId = req.params.id; // L'ID du utilisateur est passé en paramètre dans l'URL
    try {
        const user = await User.getUserById(userId);
        if (!user) {
            return res.status(404).json({ message: 'utilisateur non trouvé' });
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: 'Erreur lors de la récupération du utilisateur' });
    }
}
exports.updateUserForm = async(req, res) => {
    const userId = req.params.id; // L'ID du utilisateur est passé en paramètre dans l'URL
    try {
        const user = await User.getUserById(userId);
        if (!user) {
            return res.status(404).json({ message: 'utilisateur non trouvé' });
        }
        res.render('modUser', { user });
    } catch (err) {
        res.status(500).json({ message: 'Erreur lors de la récupération du utilisateur' });
    }
}

// Contrôleur pour mettre à jour un utilisateur
exports.updateUser = async(req, res) => {
    const userId = req.params.id; // L'ID du utilisateur est passé en paramètre dans l'URL
    const userData = req.body;
    console.log(userId);
    console.log(userData);
    try {
        const user = await User.updateUserById(userId, userData);
        if (!user) {
            return res.status(404).json({ message: 'utilisateur non trouvé' });
        }
        res.redirect("/user")
    } catch (err) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour du utilisateur' });
    }
}

// Contrôleur pour supprimer un utilisateur
exports.deleteUser = async(req, res) => {
    const userId = req.params.id; // L'ID du utilisateur est passé en paramètre dans l'URL
    console.log(userId);
    try {
        const user = await User.deleteUserById(userId);
        if (!user) {
            return res.status(404).json({ message: 'utilisateur non trouvé' });
        }
        res.redirect('/user');
    } catch (err) {
        res.status(500).json({ message: 'Erreur lors de la suppression du utilisateur' });
    }
}

exports.addUserForm = async(req, res) => {
    res.render('addUser')
}

exports.addUser = async(req, res) => {
    const { nom, mail, mailContact, age } = req.body;
    console.log({ nom, mail, mailContact, age });
    try {
        const newUser = await User.createUser({
            pn: nom,
            mail: mail,
        })
        console.log('nouvel utilisateur:', newUser);
        //save user in mongodb
        console.log(`Utilisateur bien rentré sous l'ID ${newUser.id}`);
        res.redirect('/user');
    } catch (err) {
        res.status(500).json({ message: 'Erreur lors de la création du utilisateur' });
    }
}

exports.showProfile = async(req, res) => {
    //get userid from session into userId const
    const userId = req.session.userId;
    console.log(userId);
    try {
        const user = await User.getUserById(userId);
        if (!user) {
            return res.status(404).json({ message: 'utilisateur non trouvé' });
        }
        res.render('profil', { user });
    } catch (err) {
        res.status(500).json({ message: 'Erreur lors de la récupération du utilisateur' });
    }
}