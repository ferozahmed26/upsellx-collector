require('./globals/utility.global');
const http = require('http'),
    express = require('express'),
    mysqlDataService = require('./services/mysql-data.service'),
    collector = require('./controllers/collector.controller'),
    config = require('./config/app.config')(),
    app = express(),
    server = http.createServer(app);

    mysqlDataService.connect(config.mysql.host, config.mysql.port, config.mysql.user, config.mysql.password, config.mysql.db)
    .then(() => {
        app.get('/', (req, res) => {
            res.send('Welcome to client api!');
        });
        app.get('/clients', async (req, res, next) => {
            return await collector.clientList(req, res, next);
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
