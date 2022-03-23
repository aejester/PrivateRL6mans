import { ActiveQueue } from "./StructureQueue";
import fs from "fs";

interface Manipulatable {
    [key: string]: any;
}

interface Match {
    matchID: string;
    team1: string[];
    team2: string[];
    winner: string;
    voted: string;
}

interface User {
    elo: number;
    wins: number;
    losses: number;
}

class Database {

    public static reportMatch(guildID: string, channelID: string, queue: ActiveQueue): void {
        if (!fs.existsSync("../../data/"+guildID)) {
            fs.mkdirSync("../../data/"+guildID);
            fs.mkdirSync("../../data/"+guildID+"/"+channelID);
        }

        if (!fs.existsSync("../../data/"+guildID+"/"+channelID+".json")) {
            fs.writeFileSync("../../data/"+guildID+"/"+channelID+".json", JSON.stringify({}));
            fs.writeFileSync("../../data/"+guildID+"/"+channelID+"/users.json", JSON.stringify({}));
        }

        let composableObject: Manipulatable = JSON.parse(fs.readFileSync("../../data/"+guildID+"/"+channelID+".json", "utf8"));
        let userObject: Manipulatable = JSON.parse(fs.readFileSync("../../data/"+guildID+"/"+channelID+"/users.json", "utf8"));

        if (composableObject === {}) {
            composableObject["matches"] = []
            composableObject["users"] = []
        }

        let formattedMatch: Match = {
            matchID: queue.matchID,
            team1: queue.team1.map(player => player.name),
            team2: queue.team2.map(player => player.name),
            winner: queue.winner,
            voted: queue.voted
        }

        composableObject["matches"].push(formattedMatch);

        // https://wikimedia.org/api/rest_v1/media/math/render/svg/7c80282e9c95e92d6b210467aab48a8c4c81ef10

        // Ea = 1/(1+10^((Rb - Ra)/400))
        // gainA = K * (win - Ea)

        // Eb = 1/(1+10^((Ra - Rb)/400))
        // gainB = K * (win - Eb)

        let team1Sum: number = 0;
        let team2Sum: number = 0;

        for (let i = 0; i < queue.team1.length; i++) {
            team1Sum += userObject[queue.team1[i].id].elo == undefined ? 600 : userObject[queue.team1[i].id].elo;
        }

        for (let i = 0; i < queue.team2.length; i++) {
            team2Sum += userObject[queue.team2[i].id].elo == undefined ? 600 : userObject[queue.team2[i].id].elo;
        }

        let expectedA: number = 1 / (1 + Math.pow(10, (team2Sum - team1Sum)/400));
        let gainA: number = 32 * ((queue.winner == "team1" ? 1 : 0) - expectedA);

        let expectedB: number = 1 / (1 + Math.pow(10, (team1Sum - team2Sum)/400));
        let gainB: number = 32 * ((queue.winner == "team2" ? 1 : 0) - expectedB);

        for (let i = 0; i < queue.team1.length; i++) {
            let userObj = userObject[queue.team1[i].id];
            if (userObj == undefined) {
                userObj = {
                    elo: 600,
                    wins: 0,
                    losses: 0
                }
            }

            userObj["elo"] += gainA;

            if (queue.winner == "team1") {
                userObj["wins"] += 1;
            } else {
                userObj["losses"] += 1;
            }

            userObject[queue.team1[i].id] = userObj;
        }

        for (let i = 0; i < queue.team2.length; i++) {
            let userObj = userObject[queue.team2[i].id];
            if (userObj == undefined) {
                userObj = {
                    elo: 600,
                    wins: 0,
                    losses: 0
                }
            }

            userObj["elo"] += gainB;

            if (queue.winner == "team2") {
                userObj["wins"] += 1;
            } else {
                userObj["losses"] += 1;
            }

            userObject[queue.team2[i].id] = userObj;
        }

        fs.writeFileSync("../../data/"+guildID+"/"+channelID+"/users.json", JSON.stringify(userObject));
    }

    public static getUserFromDatabase(guildID: string, channelID: string, userID: string): User {
        let userObject: Manipulatable = JSON.parse(fs.readFileSync("../../data/"+guildID+"/"+channelID+"/users.json", "utf8"));

        return userObject[userID];
    }

}

export default Database;