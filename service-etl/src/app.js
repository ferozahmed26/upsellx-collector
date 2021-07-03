require('./globals/utility.global');
const http = require('http'),
    express = require('express'),
    mongoService = require('./services/mongo.service'),
    mysqlDataService = require('./services/mysql-data.service'),
    receiverRMQ = require('./services/amqp.receiver'),
    config = require('./config/app.config')(),
    app = express(),
    server = http.createServer(app);

mongoService.db.connect(
    `mongodb://${config.mongo.host}:${config.mongo.port}/upsellx`,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log('Mongo connected');
        return mysqlDataService.connect(config.mysql.host, config.mysql.port, config.mysql.user, config.mysql.password, config.mysql.db);
    })
    .then(() => {
        console.log('Mysql connected');
        return receiverRMQ.connect(config.rabbit.host, config.rabbit.port);
    })
    .then(() => {
        receiverRMQ.receive();
        app.get('/', (req, res) => {
            res.send('Welcome to data collector!');
        });

        server.listen(config.port, () => {
            const host = server.address().address || '';
            const port = server.address().port;
            console.log("Example app listening at http://%s:%s", host, port)
        });

    }).catch(e => {
        console.log(e);
        process.exit()
    });
