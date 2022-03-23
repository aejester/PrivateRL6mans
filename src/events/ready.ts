import { Client } from "discord.js";
import { Logger } from "../util/Logger";
import Commands from "../Commands";

export default (client: Client, logger: Logger): void => {
    client.on("ready", async () => {
        if (!client.user || !client.application) {
            return;
        }

        await client.application.commands.set(Commands);

        logger.log(`${client.user.username}#${client.user.discriminator} is online and listening in ${client.guilds.cache.size} servers.`)
    })
}