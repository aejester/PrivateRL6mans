import { Client, Message, MessageEmbed } from "discord.js";
import { Logger } from "../util/Logger";
import { StructureQueue, Player } from "../util/StructureQueue";
import Command from "./Command";

const Leave: Command = {
    name: "leave",
    description: "Takes the player out of the queue.",
    run: async (client: Client, message: Message, logger: Logger, queues: StructureQueue) => {
        let queueID: string = message.channel.id;
        let index = -1;

        if (queues[message.guild!.id+"/"+queueID] == undefined) {
            queues[message.guild!.id+"/"+queueID] = [];
        }

        let firstQueuable: number = 0;

        for (let i = 0; i < queues[message.guild!.id+"/"+queueID].length; i++) {
            if ("length" in queues[message.guild!.id+"/"+queueID][i]) {
                firstQueuable = i;
            }
        }

        for (let i = 0; i < queues[message.guild!.id+"/"+queueID].length; i++) {
            if ((<Player[]> queues[message.guild!.id+"/"+queueID][firstQueuable])[i].id == message.author.id) {
                index = i;
                break;
            }
        }

        if (index != -1) {
            queues[message.guild!.id+"/"+queueID].splice(index, 1);

            let stringified: string = (<Player[]> queues[message.guild!.id+"/"+queueID][firstQueuable]).map((p) => {
                return "<@"+p.id+">"
            }).join(", ")

            let status = stringified == "" ? "No one is in the Queue!" : stringified

            let embed: MessageEmbed = new MessageEmbed()
                                        .addField("Player Left", `${message.author}`)
                                        .addField("Queue Status", status)
                                        .setColor("RED")

            message.reply({
                embeds: [embed] 
            });
        } else {
            message.reply({
                content: "You are not in the queue!"
            });
        }

    }
}

export default Leave;