import express from "express";
const app = express();
const PORT = 5002;
import { connect as _connect } from "amqplib";
var channel, connection;

connect();
async function connect() {
    try {
        const amqpServer = "amqp://localhost:5672";
        connection = await _connect(amqpServer);
        channel = await connection.createChannel();
        await channel.assertQueue("session");
        channel.consume("session", data => {
            console.log(`Received data at 5002: ${Buffer.from(data.content)}`);
            channel.ack(data);
        });
    } catch (ex) {
        console.error(ex);
    }
}

app.listen(PORT, () => {
    console.log(`Server at ${PORT}`);
});
