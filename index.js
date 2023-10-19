const express = require('express');
const favicon = require('serve-favicon');
const pathfav = require('path');
const path = require('path');
const app = express();
const port = 8000;
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://dondeh:oN2zzGPzlK9ZfJAx@bookeddb.ktpbsek.mongodb.net/Booksdb?retryWrites=true&w=majority";
const mongoose = require('mongoose');
const { encryptData, decryptData } = require('./ecryption');
const connect_Controler = require('./controlers/connect_Controler');
const livre_Controler = require('./controlers/livre_Controler');
const user_Controler = require('./controlers/utilisateur_Controler');
const bodyParser = require('body-parser');
const errorLogger = require('./middlewares/errorLogger'); // Remplacez le chemin par le chemin correct vers votre module de journalisation des erreurs

// Import des middlewares séparés
const { csrfMiddleware, sessionMiddleware, customErrorHandler, formParser, cookieParser } = require('./middlewares');
const csrfProtection = require('./middlewares/csrf');

// Utilisation des middlewares
app.use(express.static('public'));
app.use(sessionMiddleware);
app.use(cookieParser); // Mettez cookieParser après sessionMiddleware
app.use(csrfMiddleware);
app.use(formParser);
app.use(customErrorHandler);
app.use(bodyParser.json());


mongoose.connect(uri);
db = mongoose.connection;
db.on('error', console.error.bind(console, 'Erreur lors de la connexion'));
db.once('open', () => {
    console.log(`Connexion à la base OK`);
});
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}
run().catch(console.dir);
// Utilisation des middlewares
app.use(favicon(pathfav.join(__dirname, 'public', 'img', 'favicon.ico')));


// Définir le dossier des fichiers statiques
app.use(express.static(path.join(__dirname, 'views')));

// Configuration du moteur de template EJS
app.set('view engine', 'ejs');
//add css files
app.use(express.static(__dirname + '/public'));
app.use((req, res, next) => {
    if (req.url.endsWith('.css')) {
        res.type('text/css');
    }
    next();
});

// Utilisation des routes
app.get('/', csrfProtection, (req, res) => {
    console.log('Token to Browser/form home: ' + req.csrfToken());
    const csrfToken = req.csrfToken();
    res.render('index', { csrfToken });
});

app.post('/login', csrfProtection, async(req, res) => {
    console.log('Token from Browser/form login: ' + req.body._csrf)
    try {
        await connect_Controler.login(req, res);
        // La connexion a réussi, vous pouvez rediriger l'utilisateur ou envoyer une réponse
        res.redirect('/discover'); // Exemple de redirection après une connexion réussie
    } catch (error) {
        console.error(error);
    }
});

app.post('/signup', csrfProtection, async(req, res) => {
    console.log('Token from Browser/form signup: ' + req.body._csrf)
    try {
        await connect_Controler.register(req, res);
        // La connexion a réussi, vous pouvez rediriger l'utilisateur ou envoyer une réponse
        res.redirect('/discover'); // Exemple de redirection après une connexion réussie
    } catch (error) {
        console.error(error);
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Erreur lors de la déconnexion :', err);
        } else {
            res.redirect('/'); // Redirigez vers la page d'accueil ou une autre page après la déconnexion
        }
    });
});
// Route pour la page "livre"
app.get('/livre', livre_Controler.getAllLivres);

app.get('/ajouterLivre', csrfProtection, async(req, res) => {
    console.log('Token to Browser/form ajouterLivre: ' + req.csrfToken());
    const csrfToken = req.csrfToken();
    res.render('ajouterLivre', { csrfToken });
});


app.post('/ajouterLivre', csrfProtection, async(req, res) => {
    console.log('Token from Browser/form login: ' + req.body._csrf)
    try {
        await livre_Controler.ajouterLivre(req, res);
        res.redirect("/livre");
    } catch (error) {
        errorLogger.error(`Erreur route ajout livre: ${error}`)
    }
});

app.get('/modLivre/:id', livre_Controler.afficherFormModLivre);
app.post('/updateLivre/:id', livre_Controler.updateLivre);

app.get('/delLivre/:id', livre_Controler.deleteLivre)
    // Route pour la page "user"
app.get('/user', user_Controler.getAllUsers);

app.get('/addUser', user_Controler.addUserForm)

app.post('/addUser', (req, res) => {
    user_Controler.addUser(req, res)
});
app.get('/delUser/:id', user_Controler.deleteUser)

app.get('/modUser/:id', user_Controler.updateUserForm)

app.post('/updateUser/:id', user_Controler.updateUser);

app.get('/lireLivre/:id', livre_Controler.afficherLivreSelection)

app.get('/discover', csrfProtection, async(req, res) => {
    console.log('Token to Browser/form discover: ' + req.csrfToken());
    const livres = await livre_Controler.getLatestLivres();
    const isConnected = await connect_Controler.isConnected(req);
    const dpn = req.session.dpn
    const csrfToken = req.csrfToken();
    res.render('decouvrir', { livres, isConnected, dpn, csrfToken });
});

app.get('/discover/:id', livre_Controler.getLivreById);

app.get('/discover/:genre', livre_Controler.getLivresByGenre)

app.get('/profil', async(req, res) => {
    const isConnected = await connect_Controler.isConnected(req);
    const isMyProfile = await connect_Controler.isMyProfile(req);
    const dpn = req.session.dpn
    res.render('profil', { isConnected, isMyProfile, dpn })
})

app.post('/encrypt', (req, res) => {
    const { data } = req.body
    const encryptedData = encryptData(data)
    res.send(encryptedData)
})


app.get('/decrypt', (req, res) => {
    const { data } = req.body;
    const decryptedData = decryptData(data);
    res.send(decryptedData);
});

// ... autres routes

app.listen(port, () => {
    console.log(`Le serveur est en cours d'exécution sur le port "${port}" sur le serveur "http://localhost:${port}"`);
});