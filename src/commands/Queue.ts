import { BaseCommandInteraction, ButtonInteraction, Client, Collector, CollectorFilter, Message, MessageEmbed } from "discord.js";
import { PoppedQueue } from "../util/PoppedQueue";
import { Logger, Severity } from "../util/Logger";
import { StructureQueue, Player, ActiveQueue } from "../util/StructureQueue";
import Command from "./Command";

const Queue: Command = {
    name: "q",
    description: "Adds the player to the queue.",
    run: async (client: Client, message: Message, logger: Logger, queues: StructureQueue) => {
        let queueID: string = message.channel.id;
        let found: boolean = false;

        if (queues[message.guild!.id+"/"+queueID] == undefined) {
            queues[message.guild!.id+"/"+queueID] = [[]];
        }

        let firstQueuable: number = 0;

        for (let i = 0; i < queues[message.guild!.id+"/"+queueID].length; i++) {
            if ("length" in queues[message.guild!.id+"/"+queueID][i]) {
                firstQueuable = i;
            }
        }

        if (Array.isArray(queues[message.guild!.id+"/"+queueID][firstQueuable])) {
            for (let i = 0; i < (<Player[]> queues[message.guild!.id+"/"+queueID][firstQueuable]).length; i++) {
                if ((<Player[]> queues[message.guild!.id+"/"+queueID][firstQueuable])[i].id == message.author.id) {
                    found = true;
                    break;
                }
            }
        }

        if (!found) {
            (<Player[]> queues[message.guild!.id+"/"+queueID][firstQueuable]).push({
                name: message.author.username,
                id: message.author.id
            });

            let stringified: string = (<Player[]> queues[message.guild!.id+"/"+queueID][firstQueuable]).map((p) => {
                return "<@"+p.id+">"
            }).join(", ")

            let embed: MessageEmbed = new MessageEmbed()
                                        .addField("Player Joined", `${message.author}`)
                                        .addField("Queue Status", stringified)
                                        .setColor("GREEN")

            if (queues[message.guild!.id+"/"+queueID].length == 6) {
                let builtEmbed = PoppedQueue.buildEmbedForVoting((<Player[]> queues[message.guild!.id+"/"+queueID][firstQueuable]));
                let row = PoppedQueue.getActionRowForVoting(queueID);

                message.reply({
                    embeds: [embed, builtEmbed],
                    content: (<Player[]> queues[message.guild!.id+"/"+queueID][firstQueuable]).map(member => `<@${member.id}>`).join(", ")+", the queue has filled. React below to vote. Teams must be picked within 2 minutes or the 6mans will cancel."
                });

                let activeQueue: ActiveQueue = {
                    matchID: "",
                    team1: [],
                    team2: [],
                    voted: "",
                    captains: 0,
                    randoms: 0,
                    winner: "",
                    members: (<Player[]> queues[message.guild!.id+"/"+queueID][firstQueuable]).map((player: Player) => player),
                    channelID: queueID,
                    guildID: message.guildId!
                }

                queues[message.guild!.id+"/"+queueID][firstQueuable] = activeQueue;

                
            } else {
                message.reply({
                    embeds: [embed] 
                });
            }
        } else {
            message.reply({
                content: "You are already in the queue!"
            });
        }

    }
}

export default Queue;