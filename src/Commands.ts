import Captains from "./commands/Captains";
import Command from "./commands/Command";
import Leave from "./commands/Leave";
import Ping from "./commands/Ping";
import Queue from "./commands/Queue";
import Randoms from "./commands/Randoms";
import Report from "./commands/Report";

const Commands: Command[] = [Ping, Queue, Leave, Captains, Report, Randoms];

export default Commands;