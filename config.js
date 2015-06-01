var config = {};

config.mongoUri = 'mongodb://localhost:27017/alarme'
config.cookieMaxAge = 30 * 24 * 3600 * 1000;//1 mês em milissegundos
module.exports = config;