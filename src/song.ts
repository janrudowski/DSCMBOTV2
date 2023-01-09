import { Argument, ParamTypes } from "../types/types";
import * as usetube from "usetube";
import getId from "./utils/getId";

export default class Song {
  public readonly id: string = getId();
  constructor(
    public readonly url: string,
    public readonly title: string,
    public readonly artist: string,
    public readonly duration: number
  ) {}

  private static getPlaylistId(url: string): string {
    const searchedString = "list=";
    const srchStrLen = searchedString.length;
    return url.substring(url.indexOf("list=") + srchStrLen, url.length);
  }

  private static getSongUrl(id: string): string {
    return `https://www.youtube.com/watch?v=${id}`;
  }
  public static async createSong(param: Argument) {
    try {
      const { argument, type } = param;
      switch (true) {
        case type === ParamTypes.youtube_song || type === ParamTypes.string:
          const responseSong = await usetube.searchVideo(param.argument);
          if (!responseSong) throw new Error("Cannot get this song.");
          const {
            original_title: title,
            duration,
            artist,
            id,
          } = responseSong.videos[0];
          return new Song(this.getSongUrl(id), title, artist, duration);

        case type === ParamTypes.youtube_playlist:
          const responseSongs = await usetube.getPlaylistVideos(
            this.getPlaylistId(argument)
          );
          if (!responseSongs) throw new Error("Cannot get playlist.");
          const songs: Song[] = [];
          responseSongs.forEach((song) =>
            songs.push(
              new Song(
                this.getSongUrl(song.id),
                song.title,
                song.artist,
                song.duration
              )
            )
          );
          return songs;
        default:
          throw new Error("Unexpected error.");
      }
    } catch (err) {
      throw err;
    }
  }
}
