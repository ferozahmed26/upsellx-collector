const amqp = require('amqplib/callback_api');
const dataCollector = require('./../controllers/collector.controller');

receiverRMQ = {
    channel: null,
    connection: null,
    connect: function(host, port) {
        const that = this;
        return new Promise((resolve, reject) => {
            amqp.connect(`amqp://${host}`, function(error0, connection) {
                if (error0) {
                    reject(error0);
                }
                that.connection = connection;
                connection.createChannel(function(error1, channel) {
                    if (error1) {
                        reject(error1);
                    }
                    that.channel = channel;
                    resolve();
                });
            });
        });
    },
    receive: function () {
        const queue = 'extract-data';
        this.channel.assertQueue(queue, {
            durable: false
        });
        this.channel.consume(queue, function(msg) {
            const clientId = msg.content.toString();
            console.log(" [x] Received %s", clientId);
            dataCollector.runCollectorAsync(clientId).then();
        }, {
            noAck: true
        });
    }
}

module.exports = receiverRMQ;
