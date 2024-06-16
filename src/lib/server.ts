/**
 * Listens to UDP datagram socket and sends to every clients connecteds the messages it receives
 */
import dgram from 'dgram';

export default class Server {
    clients:Map<string, dgram.RemoteInfo> = new Map();
    server:dgram.Socket;

    constructor(host:string, port:number) {
        this.server = dgram.createSocket('udp4');

        let that = this;
        
        this.server.on('message', (msg, rinfo) => this.onMessage(msg, rinfo));
        this.server.on('listening', () => this.onListening());
        this.server.on('close', () => this.onClose());
        this.server.on('error', (error:Error) => this.onError(error));

        this.server.bind(port, host);
    }

    onMessage(msg:Buffer, rinfo:dgram.RemoteInfo) {
        let key = `${rinfo.address}:${rinfo.port}`;
        this.clients.has(key) || this.clients.set(key, rinfo);

        this.sendReceivedMessage(msg, rinfo);
    }

    sendReceivedMessage(msg:Buffer, rinfo:dgram.RemoteInfo) {
        let new_msg = `Message received from ${rinfo.address}:${rinfo.port} => ${msg.toString()}`;
        this.clients.forEach((value:dgram.RemoteInfo, key:string) => {
            if (key != `${rinfo.address}:${rinfo.port}`) {
                this.server.send(new_msg, value.port, value.address);
            }
        });
    }

    onListening() {
        let address = this.server.address();
        console.log(`Server listening at ${address.address}:${address.port}, family: ${address.family}`);
    }

    onClose() {
        console.log('Server socket is closed!')
    }

    onError(error:Error) {
        console.log(error);
        this.server.close();
    }
}
