const WebSocket = require('ws').Server;
const wsServer = new WebSocket({port: 8080});

const broadcast = (message) => {

    setTimeout(() => {
        wsServer.clients.forEach((client) => {
            console.log(client);
            if (client.readyState === 1)
                client.send(message);
        });
    }, 1500)
};

module['exports'] = {wsServer, broadcast};
