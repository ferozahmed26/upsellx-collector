const amqp = require('amqplib/callback_api');

senderRMQ = {
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
    send: function (msg) {

        const queue = 'extract-data';
        const that = this;

        this.channel.assertQueue(queue, {
            durable: false
        });
        this.channel.sendToQueue(queue, Buffer.from(msg));

        console.log(" [x] Sent %s", msg);

        setTimeout(function() {
            that.connection.close();
        }, 500);
    }
}
module.exports = senderRMQ;
