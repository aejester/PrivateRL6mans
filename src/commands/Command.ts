import { ChatInputApplicationCommandData, Client, Message } from "discord.js";
import { Logger } from "../util/Logger";
import { StructureQueue } from "../util/StructureQueue";

interface Command extends ChatInputApplicationCommandData {
    run: (client: Client, message: Message, logger: Logger, queues: StructureQueue) => void;
}

export default Command;