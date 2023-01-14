import { VoiceChannel, Message } from "discord.js";
import {
  joinVoiceChannel,
  createAudioPlayer,
  JoinVoiceChannelOptions,
  CreateVoiceConnectionOptions,
  NoSubscriberBehavior,
  VoiceConnection,
  AudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
  AudioPlayerError,
  PlayerSubscription,
} from "@discordjs/voice";

import Interaction from "../interaction/interaction";

import * as playDL from "play-dl";

//TODO: PODMIEN SWOJA METODE
import { Queue } from "./queue";
import formatTime from "../utils/formatTime";

export class Player extends Queue {
  private connection: VoiceConnection | undefined = undefined;
  private audioPlayer: AudioPlayer | undefined = undefined;
  private channel: VoiceChannel | undefined = undefined;
  private subscription: PlayerSubscription | undefined = undefined;
  private interaction: Interaction | undefined = undefined;
  private currentMessage: Message<true> | undefined = undefined;
  public isPlaying: boolean = false;
  public isPaused: boolean = false;
  constructor() {
    super();
  }

  public getPlayerVoiceChannel() {
    return this.channel;
  }

  private createConnection(
    params: JoinVoiceChannelOptions & CreateVoiceConnectionOptions
  ) {
    this.connection = joinVoiceChannel({
      channelId: params.channelId,
      guildId: params.guildId,
      adapterCreator: params.adapterCreator,
    });

    this.audioPlayer = createAudioPlayer({
      behaviors: {
        noSubscriber: NoSubscriberBehavior.Play,
      },
    });
  }

  private async createAndStreamResource() {
    try {
      const stream = await playDL.stream(this.getCurrent().url);
      const resource = createAudioResource(stream.stream, {
        inputType: stream.type,
      });
      this.audioPlayer!.play(resource);
      this.isPlaying = true;
      const { title, artist, duration } = this.getCurrent();
      const durationInMinutes = formatTime(duration);
      this.currentMessage = await this.interaction!.sendPlayer(
        title,
        artist,
        durationInMinutes,
        this.getNumberOfSongs()
      );
    } catch (err) {
      this.interaction!.sendError("Cannot play this video");
      this.remove(this.getCurrent().id);
      if (this.getNumberOfSongs() === 0) {
        this.stopPlayer();
        return;
      }
      this.playSong(this.channel!, this.interaction!);
    }
  }

  private handleError(err: AudioPlayerError) {
    throw err;
  }

  private stopPlayer() {
    this.audioPlayer!.off(AudioPlayerStatus.Idle, this.handleIdle);
    this.audioPlayer!.off("error", this.handleError);
    this.subscription!.unsubscribe();
    this.connection!.destroy();
    this.isPlaying = false;
    this.isLoop = false;
    this.isPaused = false;
    this.audioPlayer = undefined;
    this.subscription = undefined;
    this.connection = undefined;
    this.clearQueues();
    this.interaction?.send("👋Bye!");
  }

  public skip(): void {
    this.isLoop = false;
    this.isPaused = false;
    this.audioPlayer!.stop(true);
  }

  public loop(): void {
    this.isLoop = !this.isLoop;
  }

  public pause(): void {
    if (this.isPaused) {
      this.audioPlayer!.unpause();
      this.isPaused = false;
    } else {
      this.audioPlayer!.pause();
      this.isPaused = true;
    }
  }

  public stop(): void {
    this.stopPlayer();
  }

  private handleIdle() {
    this.currentMessage?.delete();
    if (this.getNumberOfSongs() === 1 && !this.isLoop) {
      this.stopPlayer();
      return;
    }
    const currentPlaying = this.getCurrent();
    if (!currentPlaying) return;
    if (!this.isLoop) this.remove(currentPlaying.id);
    this.playSong(this.channel!, this.interaction!);
  }

  public async playSong(
    channel: VoiceChannel,
    interaction: Interaction
  ): Promise<void> {
    try {
      if (!this.connection && !this.audioPlayer) {
        this.channel = channel;
        this.createConnection({
          channelId: channel.id,
          guildId: channel.guild.id,
          adapterCreator: channel.guild.voiceAdapterCreator,
        });
        this.subscription = this.connection!.subscribe(this.audioPlayer!);
        this.audioPlayer!.on("error", this.handleError.bind(this));
        this.audioPlayer!.on(
          AudioPlayerStatus.Idle,
          this.handleIdle.bind(this)
        );
      }
      this.interaction = interaction;
      await this.createAndStreamResource();
    } catch (err) {
      throw err;
    }
  }
}

//TODO: usun listenery z metody bo memory leak (np stworz instancje player w tym miejscu i importuj ja tam gdzie potrzeba)

// export class Player {
//   constructor(
//     private readonly connection: VoiceConnection,
//     private readonly player: AudioPlayer
//   ) {}
//   static createConnection(
//     params: JoinVoiceChannelOptions & CreateVoiceConnectionOptions
//   ): Player {
//     const connection = joinVoiceChannel({
//       channelId: params.channelId,
//       guildId: params.guildId,
//       adapterCreator: params.adapterCreator,
//     });
//     const player = createAudioPlayer({
//       behaviors: {
//         noSubscriber: NoSubscriberBehavior.Pause,
//       },
//     });
//     return new Player(connection, player);
//   }
//   public destroyConnection() {
//     this.connection.destroy();
//   }
//   public playResource()
// }
