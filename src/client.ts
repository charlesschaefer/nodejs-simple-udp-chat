import Client from './lib/client';

const SERVER_HOST = '127.0.0.1';
const SERVER_PORT = 2222;

let client = new Client(SERVER_HOST, SERVER_PORT);

// reads message from user stdin
console.log("Please, type your message...");

process.stdin.on("data", (data:Buffer) => {
    client.sendMessage(data.toString());
});