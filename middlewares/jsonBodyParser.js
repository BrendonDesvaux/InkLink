const bodyParser = require('body-parser');

const formParser = bodyParser.urlencoded({ extended: false });

module.exports = formParser;