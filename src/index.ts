import { MessageHandlers, ServiceBusClient } from "@azure/service-bus";
import { config } from "dotenv";

config();

async function main() {
    const date = new Date().toLocaleString();
    const topic = 'testtopic';
    const client: ServiceBusClient = new ServiceBusClient(process.env.ROOT_MANAGE_SHARED_ACCESS_KEY!);
    const sender = client.createSender(topic);
    const receiver1 = client.createReceiver(topic, "testsubscription");
    const receiver2 = client.createReceiver(topic, "testsub");

    let count = 0;
    console.log("sender start sending messages");
    setInterval(() => {
        sender.sendMessages({ body: { type: "testMessage", count: count++, date } });
    }, 500);

    const createHandler = (subscriberName: string): MessageHandlers => ({
        processMessage: async m => {
            console.log(`${subscriberName} ${JSON.stringify(m.body)}`)
        },
        processError: async e => {
            console.error(e)
        }
    });

    setTimeout(() => receiver1.subscribe(createHandler("receiver1")), 1000);
    setTimeout(() => receiver2.subscribe(createHandler("receiver2")), 1000);
}

main();