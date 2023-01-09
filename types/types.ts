import { Command } from "./../src/commands";
import Interaction from "../src/interaction";
import {
  DMChannel,
  PartialDMChannel,
  NewsChannel,
  TextChannel,
  PublicThreadChannel,
  PrivateThreadChannel,
  VoiceChannel,
  VoiceBasedChannel,
  TextBasedChannel,
} from "discord.js";
export interface Config {
  DISCORD_TOKEN: string;
  COMMAND_PREFIX: string;
}

export type ChannelType =
  | DMChannel
  | PartialDMChannel
  | NewsChannel
  | TextChannel
  | PublicThreadChannel
  | PrivateThreadChannel
  | VoiceChannel;

export enum ParamTypes {
  youtube_song = "youtube_song",
  youtube_playlist = "youtube_playlist",
  string = "string",
}

export enum CommandRules {
  voice_required,
  voice_same_as_player_required,
  player_required,
}

export interface Params {
  command: Command;
  params?: Argument[];
}

export interface Argument {
  argument: string;
  type: ParamTypes;
}

export interface CommandParams {
  name: string;
  expectedParams?: Array<ParamTypes[] | ParamTypes>;
  actions: Array<Handler<Promise<void> | void>> | Handler<Promise<void> | void>;
  description?: string;
  rules?: CommandRules[];
}

export interface IServer {
  isCommand: (message: string) => boolean;
  getParams: (message: string) => Params;
  // play: () => Promise<void>;
  // skip: () => Promise<void>;
}

export interface ICommand {
  triggerActions: () => void;
}

export interface Handler<T> {
  (
    params: Argument[],
    channel: TextChannel,
    interaction: Interaction,
    voiceChannel?: VoiceChannel
  ): T;
}
