import { Client, Message, MessageEmbed } from "discord.js";
import { Logger } from "../util/Logger";
import { StructureQueue } from "../util/StructureQueue";
import Command from "./Command";

const Ping: Command = {
    name: "ping",
    description: "Tests the bot for the amount of time it takes to reach the server and respond.",
    run: async (client: Client, message: Message, logger: Logger, queues: StructureQueue) => {
        let embed: MessageEmbed = new MessageEmbed()
                                        .addField("Ping Test", `API Latency is ${Math.round(client.ws.ping)}ms`)
                                        .setColor("DARKER_GREY")
        message.reply({
            embeds: [embed]
        })
    }
}

export default Ping;