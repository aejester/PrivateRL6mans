import readEnv from "./util/envreader";
import { Client, Intents, Message } from "discord.js";

// Listeners
import ready from "./events/ready";
import { Logger, Severity } from "./util/Logger";
import { StructureQueue } from "./util/StructureQueue";
import message from "./events/message";
import Commands from "./Commands";

const ENV = readEnv();
const logger: Logger = new Logger();


// QUEUE ID: message.guild!.id+"/"+message.channel.id
let queues: StructureQueue = {};

const client = new Client({
    partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
});

client.on("messageCreate", (message: Message) => {
    if (message.channel.type == "DM") {

        

    } else if (message.content.startsWith("!")) {
        handleCommand(client, message, logger, queues);
    }
});

ready(client, logger);

const handleCommand = (client: Client, message: Message, logger: Logger, queues: StructureQueue) => {
    let commandStr: string = message.content.split(" ")[0].replace("!", "");
    const command = Commands.find(c => c.name == commandStr);
    logger.log(commandStr+" was called", Severity.debug);
    if (!command) {
        message.reply({ content: "an error has occurred."});
        return;
    }

    command.run(client, message, logger, queues);
}

client.login(ENV["token"])

