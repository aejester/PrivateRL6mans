export interface StructureQueue {
    [key: string]: (ActiveQueue|Player[])[]
}

export interface Player {
    id: string;
    name: string;
}

export interface ActiveQueue {
    matchID: string
    team1: Player[]
    team2: Player[],
    voted: string,
    captains: number,
    randoms: number,
    winner: string,
    members: Player[],
    channelID: string,
    guildID: string,
}