import { Command } from "../commands/commands";
import { IServer, Params, ParamTypes, Argument } from "../../types/types";
export default class Server implements IServer {
  constructor(
    private readonly commandPrefix: string,
    public readonly commands: Command[]
  ) {}
  public isCommand(message: string) {
    return message.startsWith(this.commandPrefix);
  }
  private getParamType(param: string): ParamTypes {
    const validUrls = [
      { url: "youtube.com/watch", type: ParamTypes.youtube_song },
      { url: "youtu.be/", type: ParamTypes.youtube_song },
      { url: "youtube.com/playlist", type: ParamTypes.youtube_playlist },
    ];
    const foundUrl = validUrls.find((url) => param.includes(url.url));
    return foundUrl ? foundUrl.type : ParamTypes.string;
  }
  public getParams(message: string): Params {
    //remove prefix from commmand, replace extra spaces (foo  bar) => (foo bar) and split into array of args
    const commandAndParams = message
      .slice(1)
      .trim()
      .match(/[^\s"']+|"([^"]*)"/gim)
      ?.map((el) => el.replace(/['"`]+/g, ""));
    if (!commandAndParams) throw new Error("Unexpected error");
    const commandName = commandAndParams[0].toLowerCase();
    const rest = commandAndParams.slice(1);

    const args: Argument[] = rest.map((arg) => {
      return { argument: arg, type: this.getParamType(arg) };
    });

    const command = this.commands.find((el) => el.name === commandName);
    if (!command || !command.active) throw new Error("Unknown command");

    if (command.expectedParams.length !== args.length) {
      throw new Error(
        `Expected ${command.expectedParams.length} argument(s). Got ${args.length}`
      );
    }

    let invalidArgs = "";
    args.forEach((arg, i) => {
      const type = arg.type;

      const expectedtype = command.expectedParams[i];
      !expectedtype.includes(type)
        ? (invalidArgs += `Error at: ${
            i + 1
          }. ${expectedtype} expected. got ${type}. \n`)
        : "";
    });
    if (invalidArgs !== "") throw new Error(invalidArgs);
    return {
      command: command,
      ...(args.length > 0 && { params: args }),
    };
  }
}
