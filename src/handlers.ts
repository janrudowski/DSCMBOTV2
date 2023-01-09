import {
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  EmbedBuilder,
} from "discord.js";
import { Player } from "./player";
import { Handler } from "../types/types";
import Song from "./song";

export const player = new Player();

export const playHandler: Handler<Promise<void>> = async (
  params,
  _,
  interaction,
  voiceChannel
) => {
  try {
    const timer = setTimeout(
      () =>
        interaction.send(
          "ℹ Please wait. Large playlists may take more time to load (20-40 seconds)."
        ),
      10_000
    );
    const song = await Song.createSong(params![0]);
    clearTimeout(timer);
    player.add(song);
    interaction.send("✅ Added.");
    if (!player.isPlaying) {
      await player.playSong(voiceChannel!, interaction);
    }
  } catch (err) {
    if (err instanceof Error) interaction.sendError(err.message);
  }
};

export const stopHandler: Handler<void> = (_, __, interaction) => {
  player.stop();
  interaction.send("⏹ Stopped and cleared queue");
};

export const skipHandler: Handler<void> = (_, __, interaction) => {
  player.skip();
  interaction.send("⏩ Skipped!");
};

export const loopHandler: Handler<void> = (_, __, interaction) => {
  player.loop();
  interaction.send(player.isLoop ? "🔁 Looped!" : "🔁 Unlooped!");
};

export const pauseHandler: Handler<void> = (_, __, interaction) => {
  interaction.send(player.isPaused ? "▶ Playing!" : "⏸ Paused!");
  player.pause();
};

export const shuffleHandler: Handler<void> = (
  params,
  channel,
  interaction,
  voiceChannel
) => {
  const isShuffled = player.shuffle();
  interaction.send(isShuffled ? "🔀 Shuffled!" : "▶ Unshuffled!");
};

// export const testHandler: Handler<void> = async (
//   params,
//   channel,
//   interaction,
//   voiceChannel
// ) => {
//   // const embed = new EmbedBuilder().setTitle("bar");
//   // const button = new ButtonBuilder()
//   //   .setCustomId("foo")
//   //   .setLabel("▶")
//   //   .setStyle(ButtonStyle.Primary);
//   // const msg = await channel.send({
//   //   components: [new ActionRowBuilder().addComponents(button)],
//   //   embeds: [embed],
//   // });
//   // setTimeout(() => {
//   //   msg.delete();
//   // }, 5000);
//   // interaction.sendPlayer("kok", "w dupie", "21:37", 5);
//   // interaction.send("qw");
// };
