import { EmbedBuilder, ButtonBuilder, ActionRowBuilder } from "discord.js";
import { TextChannel, Message, ButtonStyle } from "discord.js";

export default class Interaction {
  private channel: TextChannel | undefined = undefined;
  private playerButtons = [
    { id: "shuffle", value: "🔀" },
    { id: "loop", value: "🔁" },
    { id: "pause", value: "⏯" },
    { id: "skip", value: "⏩" },
    { id: "stop", value: "⏹" },
  ];
  private currentMessage: Message<true> | undefined = undefined;
  constructor() {}
  public setChannel(channel: TextChannel): void {
    this.channel = channel;
  }
  public sendPlayer(
    title: string,
    artist: string,
    duration: string,
    queueLength: number
  ): Promise<Message<true>> {
    if (!this.channel) throw "No channel!";
    const embed = new EmbedBuilder()
      .setColor(0x2ecc70)
      .setTitle("====== 🎵 Now playing 🎵 ======")
      .addFields(
        {
          name: "Title:",
          value: "```" + title + (artist ? " | " + artist + "```" : "```"),
        },
        {
          name: "Duration:",
          value: "```" + duration + "```",
          inline: true,
        },
        {
          name: "In queue:",
          value: "```" + queueLength + "```",
          inline: true,
        }
      );
    let buttons: ButtonBuilder[] = [];
    this.playerButtons.forEach((button) => {
      buttons.push(
        new ButtonBuilder()
          .setCustomId(button.id)
          .setLabel(button.value)
          .setStyle(ButtonStyle.Secondary)
      );
    });

    const row = new ActionRowBuilder().addComponents(buttons);
    // @ts-ignore
    return this.channel.send({ embeds: [embed], components: [row] });
  }
  public async send(content: string) {
    // if (this.currentMessage) this.currentMessage.delete();
    if (!this.channel) throw "No channel!";
    const embed = new EmbedBuilder().setColor(0x0099ff).setTitle(content);
    this.currentMessage = await this.channel.send({ embeds: [embed] });
  }
  public async sendError(content: string) {
    // if (this.currentMessage) this.currentMessage.delete();
    if (!this.channel) throw "No channel!";
    const embed = new EmbedBuilder()
      .setColor(0xed4337)
      .setTitle("❗ " + content);
    this.currentMessage = await this.channel.send({ embeds: [embed] });
  }
}
