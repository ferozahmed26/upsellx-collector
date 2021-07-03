require('./globals/utility.global');
const http = require('http'),
    express = require('express'),
    cors = require('cors'),
    bodyParser = require('body-parser'),
    mongoService = require('./services/mongo.service'),
    webSpider = require('./controllers/web-spider.controller'),
    config = require('./config/app.config')(),
    senderRMQ = require('./services/amqp.sender'),
    app = express(),
    server = http.createServer(app);

app.use(cors());
app.use(bodyParser.json());

mongoService.db.connect(
    `mongodb://${config.mongo.host}:${config.mongo.port}/upsellx`,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {
        console.log('Mongo connected');

        app.get('/', (req, res) => {
            senderRMQ.connect(config.rabbit.host, config.rabbit.port).then(() => senderRMQ.send('60df2c41527b454df8d2425c')).catch(e=> console.log(e.message));
            res.send('Welcome!');
        });

        app.post('/spider', async function (req, res, next) {
            return await webSpider.runSpiderAsync(req, res, next);
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
