const WebSocket = require('ws');

webSocketService = {
    wss: null,
    createConnection: function () {
        this.wss = new WebSocket.Server({ port: 8081 });
    },
    sendMessage: function (data) {
        console.log(data);
        console.log(data, this.wss);
        this.wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(data);
            }
        });
    }
};
module.exports = webSocketService;
