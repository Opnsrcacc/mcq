let { port: serverPort, mongodb: { host = '', port = '', database = '' } } = require('./config.json');
var CONFIG = {};
CONFIG.ENV = process.env.NODE_ENV || "development";
CONFIG.PORT = process.env.VCAP_APP_PORT || serverPort;
CONFIG.DB_URL = `mongodb://${host}:${port}/${database}`;
CONFIG.SECRET_KEY = 'MCQTaskDetails';
module.exports = CONFIG;
