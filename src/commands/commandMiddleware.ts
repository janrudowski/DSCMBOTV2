import { CommandRules } from "../../types/types";
import { CommandParams } from "../../types/types";

export default class CommandMiddleware {
  constructor() {}
  public static group(rules: CommandRules[], commands: CommandParams[]) {
    return commands.map((command) => {
      return { ...command, rules: rules };
    });
  }
}
