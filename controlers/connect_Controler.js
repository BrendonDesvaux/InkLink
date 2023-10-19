const { encryptData, decryptData } = require('../ecryption');
const User = require('../models/utilisateur')
const errorLogger = require('../middlewares/errorLogger'); // Remplacez le chemin par le chemin correct vers votre module de journalisation des erreurs


//controller pour s'inscrire dans la bdd
exports.register = async(req, res) => {
    const { pn, email, idCo } = req.body;
    console.log({ pn, email, idCo });
    const encryptedData = [encryptData(pn), encryptData(email), encryptData(idCo)];
    try {
        //get all users
        const users = await User.getAllUsers();
        //get all user mail catheogry
        const userMail = users.map(user => user.mail);
        //decrypt all userMal
        const decryptedUserMail = userMail.map(mail => decryptData(mail));
        //check if user mail is already in the database
        if (decryptedUserMail.includes(email)) {
            throw new Error(`Erreur de connexion : Identifiants ${email} deja existant`);
        }
        const newUser = await User.createUser({
            pn: encryptedData[0],
            mail: encryptedData[1],
            idCo: encryptedData[2],
            // Vous ne spécifiez pas le mot de passe ici
        });
        console.log('new user', newUser.idCo);
        req.session.dpn = pn;
        // Stockez le mot de passe encrypté dans la session
        req.session.user = {
            userId: User._id,
            mail: encryptedData[0],
        }
        return res.redirect('/discover');
    } catch (err) {
        errorLogger.error(`une erreur est survenue: ${err}`);
    }
};


//controller pour se connecter
exports.login = async(req, res) => {
    const { email, idCo } = req.body;
    console.log(email, idCo);
    const encryptedData = [encryptData(email), encryptData(idCo)];
    console.log(encryptedData);

    try {
        // On vérifie si le compte existe et que son mot de passe est correct
        const user = await User.findOne({ mail: encryptedData[0], idCo: encryptedData[1] });

        if (!user) {
            // Utilisation de status(401) pour indiquer une non autorisation
            return res.status(401).json({ message: 'Erreur de connexion : Utilisateur non trouvé' });
        }

        console.log("user:", user);

        if (user.pn != "") {
            var decrytedPn = decryptData(user.pn);
        }

        req.session.dpn = decrytedPn;
        req.session.userId = user.id;

        // On stocke le mot de passe encrypté dans la session
        req.session.user = {
            userId: user._id,
            mail: encryptedData[0],
        }

        // Connexion réussie, renvoie une réponse JSON
        return res.status(200).json({ message: 'Connexion réussie' });
    } catch (error) {
        // Erreur serveur, renvoie une réponse JSON avec un statut 500
        console.error(error);
        return res.status(500).json({ message: 'Une erreur est survenue lors de la connexion' });
    }
}
exports.isConnected = async(req) => {
    if (req.session.user) {
        console.log(req.session.dpn, "is connected");
        return true;
    } else {
        console.log("not connected");
        return false;
    }
}

exports.isMyProfile = async(req) => {
    const userId = req.session.userId;
    const user = await User.getUserById(userId);
    //if user is the same as the one watching profile, return true
    if (userId == user) {
        console.log('not the same');
        return true;
    } else {
        console.log('the same');
        return false;
    }
}