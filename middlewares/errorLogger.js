const winston = require('winston');
const { createLogger, transports, format } = winston;
const { combine, timestamp, printf } = format;
const path = require('path'); // Importer le module "path" pour manipuler les chemins

const logFormat = printf(({ timestamp, level, message }) => {
    return `${timestamp} [${level}]: ${message}`;
});

const logDir = path.join(__dirname, 'logs'); // Spécifier le chemin vers le dossier "logs"

const errorLogger = createLogger({
    format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        logFormat
    ),
    transports: [
        new transports.Console(),
        new transports.File({
            filename: path.join(logDir, `error-log-${new Date().toLocaleDateString()}.log`), // Utiliser path.join pour spécifier le chemin complet
            level: 'error',
            maxsize: 1024 * 1024,
            maxFiles: 7,
            tailable: true,
        }),
    ],
});


module.exports = errorLogger;