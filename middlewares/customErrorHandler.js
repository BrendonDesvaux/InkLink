const customErrorHandler = (err, req, res, next) => {
    if (err && err.code === 'EBADCSRFTOKEN') {
        res.status(403).send(`Token CSRF (${req.csrfToken()}) invalidenode`);
    } else {
        next();
    }
};

module.exports = customErrorHandler;