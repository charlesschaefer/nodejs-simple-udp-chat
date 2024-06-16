/**
 * Connects to a UDP datagram socket to send and receive messages from other clients
 */
import dgram from 'dgram';

export default class Client {
    client:dgram.Socket;
    remoteHost:string;
    remotePort:number;

    constructor(remote_host:string, remote_port:number) {
        this.remoteHost = remote_host;
        this.remotePort = remote_port;

        this.client = dgram.createSocket('udp4');


        this.client.on('close', () => this.onClose());
        this.client.on('listening', () => this.onListening());
        this.client.on('message', (msg, rinfo) => this.onMessage(msg, rinfo));

        this.client.bind();
    }

    onMessage(msg:Buffer, rinfo:dgram.RemoteInfo) {
        console.log(`Receving message from server: "${msg.toString()}"`);
    }

    onClose() {
        console.log("Closing client connection");
    }

    onListening() {
        console.log("Listening to the new connection on client");
    }

    sendMessage(msg:string) {
        this.client.send(msg, this.remotePort, this.remoteHost, (error, bytes) => {
            if (error) {
                console.log("Couldnt't send message to server. Error: ", error);
            } else {
                console.log(`Sent ${bytes} bytes to the server`);
            }
        })
    }
}