import { Client, Message, MessageEmbed, User } from "discord.js";
import Database from "../util/Database";
import { Logger, Severity } from "../util/Logger";
import { StructureQueue, Player, ActiveQueue } from "../util/StructureQueue";
import Command from "./Command";

interface MansUser {
    elo: number;
    wins: number;
    losses: number;
}

const Captains: Command = {
    name: "c",
    description: "Votes for captains.",
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
            (<ActiveQueue> queues[message.guild!.id+"/"+message.channel.id][indexOfVoterQueue]).captains += 1;
        }

        if ((<ActiveQueue> queues[message.guild!.id+"/"+message.channel.id][indexOfVoterQueue]).captains == 3 && (<ActiveQueue> queues[message.guild!.id+"/"+message.channel.id][indexOfVoterQueue]).voted != "") {

            let largestEloUser: MansUser = {
                elo: Number.MIN_VALUE,
                wins: 0,
                losses: 0
            }
            let messagableOne: User | undefined = undefined;

            let secondLargestEloUser: MansUser = {
                elo: Number.MIN_VALUE,
                wins: 0,
                losses: 0
            }
            let messagableTwo: User | undefined = undefined;

            for (let i = 0; i < (<ActiveQueue> queues[message.guild!.id+"/"+message.channel.id][indexOfVoterQueue]).members.length; i++) {
                let user: MansUser = Database.getUserFromDatabase(message.guildId!, message.channelId, (<ActiveQueue> queues[message.guild!.id+"/"+message.channel.id][indexOfVoterQueue]).members[i].id)
                if (user.elo > largestEloUser.elo) {
                    let temp = largestEloUser;
                    largestEloUser = user;

                    if (messagableOne! != undefined) {
                        messagableTwo = messagableOne;
                    }

                    messagableOne = client.users.cache.find(user => user.id == (<ActiveQueue> queues[message.guild!.id+"/"+message.channel.id][indexOfVoterQueue]).members[i].id)!;
                    secondLargestEloUser = temp;
                }
            }

            (<ActiveQueue> queues[message.guild!.id+"/"+message.channel.id][indexOfVoterQueue]).team1.push({id: messagableOne!.id, name: messagableOne!.username});
            (<ActiveQueue> queues[message.guild!.id+"/"+message.channel.id][indexOfVoterQueue]).team2.push({id: messagableTwo!.id, name: messagableTwo!.username});

            let usersMap: Player[] = (<ActiveQueue> queues[message.guild!.id+"/"+message.channel.id][indexOfVoterQueue]).members.filter(member => {
                if (member.id != messagableOne!.id && member.id != messagableTwo!.id) {
                    return member;
                }
            });

            let i = 1;

            let userMapString: string[] = usersMap.map(user => {
                let pulledFromDB: MansUser = Database.getUserFromDatabase(message.guild!.id, message.channel!.id, user.id);
                return i+". <@"+user.id+"> ("+pulledFromDB.elo+" elo) "+pulledFromDB.wins+" wins, "+pulledFromDB.losses+" losses, "+((pulledFromDB.wins) / (pulledFromDB.wins + pulledFromDB.losses))+" winrate"
            });

            message.channel.send({
                content: "Captains were chosen! First captain is <@"+messagableOne!.id+"> and second captain is <@"+messagableTwo!.id+">. DMs have been sent to the captains to vote."
            });

            messagableOne!.send({
                content: "You are first captain! Select **ONE** player to be on your team from the list below:\n"+userMapString.join("\n")
            });

        }
    }
}

export default Captains;