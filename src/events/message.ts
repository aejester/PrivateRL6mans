import { Client, Message } from "discord.js";
import { Logger, Severity } from "../util/Logger";
import { StructureQueue } from "../util/StructureQueue";
import Commands from "../Commands";

export default (client: Client, logger: Logger, queues: StructureQueue) => {
    client.on("messageCreate", (message: Message) => {
        console.log(message)
        if (message.content.startsWith("!")) {
            logger.log(message.content, Severity.debug);
            handleCommand(client, message, logger, queues);
        }
    })
}

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