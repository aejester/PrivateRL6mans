import { Client, Message, MessageEmbed } from "discord.js";
import { PoppedQueue } from "../util/PoppedQueue";
import { Logger, Severity } from "../util/Logger";
import { StructureQueue, ActiveQueue, Player } from "../util/StructureQueue";
import Command from "./Command";

const Randoms: Command = {
    name: "r",
    description: "Votes for random teams.",
    run: async (client: Client, message: Message, logger: Logger, queues: StructureQueue) => {
        let indexOfVoterQueue: number = -1;

        try {
            q: for (let i = 0; i < queues[message.guild!.id+"/"+message.channel.id].length - 1; i++) {
                for (let j = 0; j < (<ActiveQueue> queues[message.guild!.id+"/"+message.channel.id][i]).members.length; j++) {
                    if ((<ActiveQueue> queues[message.guild!.id+"/"+message.channel.id][i]).members[j].name == message.author.username) {
                        indexOfVoterQueue = i;
                        break q;
                    }
                }
            }
        } catch (error) {
            // Do nothing, it was a casting error and if this is the case then we can move on
            logger.log("ERROR HAPPENED", Severity.warning);
        }

        if (indexOfVoterQueue != -1) {
            (<ActiveQueue> queues[message.guild!.id+"/"+message.channel.id][indexOfVoterQueue]).randoms += 1;
        }

        if ((<ActiveQueue> queues[message.guild!.id+"/"+message.channel.id][indexOfVoterQueue]).randoms == 3 && (<ActiveQueue> queues[message.guild!.id+"/"+message.channel.id][indexOfVoterQueue]).voted != "") {
            let chosenTeams: Player[] = PoppedQueue.reroll((<ActiveQueue> queues[message.guild!.id+"/"+message.channel.id][indexOfVoterQueue]).members);

            (<ActiveQueue> queues[message.guild!.id+"/"+message.channel.id][indexOfVoterQueue]).team1 = [chosenTeams[0], chosenTeams[1], chosenTeams[2]];
            (<ActiveQueue> queues[message.guild!.id+"/"+message.channel.id][indexOfVoterQueue]).team2 = [chosenTeams[3], chosenTeams[4], chosenTeams[5]];

            (<ActiveQueue> queues[message.guild!.id+"/"+message.channel.id][indexOfVoterQueue]).voted = "randoms";

            let embed: MessageEmbed = new MessageEmbed();
            embed.setColor("GREEN");
            embed.addField("Team 1", (<ActiveQueue> queues[message.guild!.id+"/"+message.channel.id][indexOfVoterQueue]).team1.map(player => player.name).join(" "));
            embed.addField("Team 2", (<ActiveQueue> queues[message.guild!.id+"/"+message.channel.id][indexOfVoterQueue]).team2.map(player => player.name).join(" "))
            embed.addField("Match ID", (<ActiveQueue> queues[message.guild!.id+"/"+message.channel.id][indexOfVoterQueue]).matchID);

            message.channel.send({ embeds: [embed] });

        }
    }
}

export default Randoms;