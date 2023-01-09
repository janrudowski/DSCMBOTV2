import { VoiceChannel, TextChannel } from "discord.js";
import commandsList from "./commandsList";
import { player } from "./handlers";
import {
  ParamTypes,
  Argument,
  CommandParams,
  CommandRules,
} from "./../types/types";
import Interaction from "./interaction";
import { Handler } from "./../types/types";

export class Command {
  private description: string;
  constructor(
    public readonly name: string,
    public readonly active: boolean,
    public readonly expectedParams: Array<ParamTypes[]>,
    public readonly actions: Array<Handler<Promise<void> | void>>,
    public readonly rules: CommandRules[] | undefined,
    description: string = ""
  ) {
    this.description = description || this.defaultDescription();
  }
  static createCommand(params: CommandParams) {
    const actions =
      params.actions instanceof Array ? params.actions : [params.actions];
    const expectedParams =
      params.expectedParams?.map((el) => {
        return el instanceof Array ? el : [el];
      }) || [];
    return new Command(
      params.name,
      true,
      expectedParams,
      actions,
      params.rules,
      params.description
    );
  }
  private defaultDescription() {
    return `!${this.name} ${this.expectedParams?.join(" ")}`;
  }
  public getDescription() {
    return this.description;
  }
  public dispatchActions(
    params: Argument[],
    channel: TextChannel,
    interaction: Interaction,
    voiceChannel: VoiceChannel
  ): void {
    try {
      if (this.rules?.includes(CommandRules.voice_required) && !voiceChannel) {
        throw new Error("Connect to a voice channel first.");
      }
      if (
        this.rules?.includes(CommandRules.voice_same_as_player_required) &&
        voiceChannel !== player.getPlayerVoiceChannel()
      ) {
        throw new Error("You must be connected to the same voice channel.");
      }
      if (
        this.rules?.includes(CommandRules.player_required) &&
        player.getNumberOfSongs() === 0
      ) {
        throw new Error("Queue is empty.");
      }
      this.actions.forEach((action) =>
        action(params, channel, interaction, voiceChannel)
      );
    } catch (err) {
      if (err instanceof Error) throw err;
    }
  }
}

let commands: Command[] = [];

commandsList.forEach((command) =>
  commands.push(Command.createCommand(command))
);

export { commands };
