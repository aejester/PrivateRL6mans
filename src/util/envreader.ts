const fs = require("fs");

interface ReadENV {
    [key: string]: string;
}

const readEnv = (name=".env") => {
    let contents = fs.readFileSync(name, "utf-8");
    let lines = contents.split("\n");

    let processed: ReadENV = {};

    for (let i = 0; i < lines.length; i++) {
        let name: string = lines[i].split("=")[0];
        let value: string = lines[i].split("=")[1];

        processed[name] = value;
    }

    return processed;
}

export default readEnv;