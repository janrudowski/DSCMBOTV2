import { Argument } from "./types/types";
import { config } from "./src/config";
import {
  Client,
  GatewayIntentBits,
  GuildMember,
  TextChannel,
  VoiceChannel,
} from "discord.js";
import Server from "./src/server";
import { commands } from "./src/commands";
import Interaction from "./src/interaction";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

client.once("ready", () => {
  console.log("Bot online ✅");
});

client.login(config.DISCORD_TOKEN);

const server = new Server(config.COMMAND_PREFIX, commands);
const interaction = new Interaction();

client.on("messageCreate", (message) => {
  if (message.author.bot) return;
  const { content, channel, member } = message;
  if (!server.isCommand(content)) return;
  try {
    interaction.setChannel(channel as TextChannel);
    const { command, params } = server.getParams(content);
    const voiceChannel = member?.voice.channel;
    command.dispatchActions(
      params!,
      channel as TextChannel,
      interaction,
      voiceChannel as VoiceChannel
    );
  } catch (err) {
    if (err instanceof Error) interaction.sendError(err.message);
  }
});

client.on("interactionCreate", (intCreate) => {
  if (!intCreate) return;
  if (!intCreate.isButton()) return;
  const voiceChannel = (intCreate.member as GuildMember).voice
    .channel as VoiceChannel;
  const command = server.commands.find(
    (command) => intCreate.customId === command.name
  );
  const channel = intCreate.channel as TextChannel;
  command?.dispatchActions(
    {} as Argument[],
    channel,
    interaction,
    voiceChannel
  );
  intCreate.deferUpdate();
});
