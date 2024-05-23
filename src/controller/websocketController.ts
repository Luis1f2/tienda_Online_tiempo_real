import  {Server} from 'ws';

class WebSocketController {
    private wss: Server;

    constructor(server: Server) {
        this.wss = server;
        this.init();
    }

    private init() {
        this.wss.on('connection', (ws) => {
            ws.on('message', (message) => {
                console.log(`Received message: ${message}`);
                // Lógica para manejar mensajes
                ws.send(`Echo: ${message}`);
            });

            ws.send('Welcome to WebSocket server!');
        });
    }
}

export default WebSocketController;