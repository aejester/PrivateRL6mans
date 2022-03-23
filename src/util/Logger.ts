import fs from "fs";

export class Logger {
    private format: string;

    private lastLoggedDay: number | null = null;

    private logs: string[] = [];

    constructor(format: string = "[m/d/y h:M:s.S][e] c") {
        this.format = format;
    }

    public log(content: string, severity: Severity = Severity.debug) {
        let date = new Date();
        
        let day = date.getDate();
        let month = date.getMonth();
        let year = date.getFullYear();

        let hours = date.getHours();
        let minutes = date.getMinutes();
        let seconds = date.getSeconds();
        let milliseconds = date.getMilliseconds();

        let _log_ = this.format.replace("d", day.toString())
                                .replace("m", (month+1).toString())
                                .replace("y", year.toString())
                                .replace("h", hours.toString())
                                .replace("M", minutes.toString())
                                .replace("s", seconds.toString())
                                .replace("S", milliseconds.toString());
        
        _log_ = _log_.replace("e", severity);
        _log_ = _log_.replace("c", content);

        if (this.lastLoggedDay == null) {
            console.log(_log_);
            this.logs.push(_log_);
            this.lastLoggedDay = day;
        } else if (this.lastLoggedDay == day) {
            console.log(_log_);
            this.logs.push(_log_);
        } else if (this.lastLoggedDay != day) {
            this.saveLogFile("privaterl6mans_"+year+"_"+day+"_"+month+".log");

            console.log(_log_);
            this.logs.push(_log_);
            this.lastLoggedDay = day;
        }
    }

    public saveLogFile(name: string) {
        fs.writeFileSync("../logs/"+name, this.logs.join("\n"), "utf-8");
        this.logs = []
    }

}

export enum Severity {
    severe = "HIGH",
    moderate = "MODERATE",
    light = "LIGHT",
    debug = "DEBUG",
    warning = "WARNING"
}