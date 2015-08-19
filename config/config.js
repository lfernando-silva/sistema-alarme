var mongo = {
    host: "localhost",
    port: "27017",
    database: "alarme",
    user: "jabour",
    password: "123mudar"
}

var config = {
    //mongoUri: "mongodb://"+mongo.user+":"+mongo.password+"@" +mongo.host + ":" + mongo.port + "/basejabour", //conexão do ifet
    mongoUri: "mongodb://" + mongo.host + ":" + mongo.port + "/" + mongo.database, //conexão localhost
    cookieMaxAge: 30 * 24 * 3600 * 1000 //1 mês em milissegundos
};

module.exports = config;