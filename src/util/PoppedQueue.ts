import { MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
import { Player } from "./StructureQueue";

export class PoppedQueue {

    public static reroll(members: Player[]) {
        return members.sort(() => Math.random() > 0.5 ? 1: -1).map(el => el);
    }

    public static getActionRowForVoting(queueID: string): MessageActionRow {
        let row = new MessageActionRow();
        
        let captainsButton = new MessageButton();
        captainsButton.setCustomId("captains-"+queueID);
        captainsButton.setStyle("PRIMARY");
        captainsButton.setLabel("Captains");

        let randomsButton = new MessageButton();
        randomsButton.setCustomId("randoms-"+queueID);
        randomsButton.setStyle("PRIMARY");
        randomsButton.setLabel("Random Teams"); 

        row.addComponents(captainsButton, randomsButton);

        return row;
    }
    
    public static buildEmbedForVoting(members: Player[]): MessageEmbed {
        let embed = new MessageEmbed();
        embed.addField("Queue Popped", "The queue has popped!")
        embed.addField("Members", members.map(member => `<@${member.id}>`).join(", "))
        embed.setColor("BLUE");

        return embed;
    } 

}