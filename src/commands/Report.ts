import { Client, Message, MessageEmbed } from "discord.js";
import Database from "../util/Database";
import { Logger } from "../util/Logger";
import { ActiveQueue, StructureQueue } from "../util/StructureQueue";
import Command from "./Command";

const Report: Command = {
    name: "report",
    description: "Reports a match with the ID and a win.",
    run: async (client: Client, message: Message, logger: Logger, queues: StructureQueue) => {

        let reportedQueue: ActiveQueue | null = null;

        let matchID: string = message.content.split(" ")[1];
        let winOrLoss: string = message.content.split(" ")[2];

        for (let i = 0; i < queues[message.guild!.id+"/"+message.channel.id].length; i++) {
            if ((<ActiveQueue> queues[message.guild!.id+"/"+message.channel.id][i]).matchID == matchID) {
                reportedQueue = (<ActiveQueue> queues[message.guild!.id+"/"+message.channel.id][i]);
                break;
            }
        }

        if (reportedQueue == null) {
            let embed: MessageEmbed = new MessageEmbed()
                        .addField("Match Not Found", "Match could not be found. Are you sure you reported the match correctly?")
                        .setColor("RED")
            
            message.reply({
                embeds: [embed]
            });

            return;
        } else {
            for (let i = 0; i < reportedQueue.team1.length; i++) {
                if (reportedQueue.team1[i].id == message.author.id) {

                    if (winOrLoss == "win" || winOrLoss == "w") {
                        reportedQueue.winner = "team1";
                    } else if (winOrLoss == "loss" || winOrLoss == "l") {
                        reportedQueue.winner = "team2";
                    }

                }
            }

            for (let i = 0; i < reportedQueue.team2.length; i++) {
                if (reportedQueue.team2[i].id == message.author.id) {

                    if (winOrLoss == "win" || winOrLoss == "w") {
                        reportedQueue.winner = "team2";
                    } else if (winOrLoss == "loss" || winOrLoss == "l") {
                        reportedQueue.winner = "team1";
                    }

                }
            }

            Database.reportMatch(message.guild!.id, message.channel.id, reportedQueue);

            let embed: MessageEmbed = new MessageEmbed()
                                        .addField("Series Reported and Locked", "Scores have been reported and "+(reportedQueue.winner == "team1" ? "Team 1" : "Team 2")+" has won.")
                                        .setColor("GREEN")
            message.reply({
                embeds: [embed]
            });
        }

    }
}

export default Report;