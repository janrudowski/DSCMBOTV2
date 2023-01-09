import Song from "./song";

export class Queue {
  private songs: Song[] = [];
  private playingSongs: Song[] = [];
  private shuffledSongs: Song[] = [];
  private isShuffled: boolean = false;
  public isLoop: boolean = false;
  constructor() {
    this.playingSongs = this.songs;
  }

  private addAndShuffle(song: Song): void {
    this.shuffledSongs.push(song);
    const i = ~~(Math.random() * this.shuffledSongs.length);
    const j = this.shuffledSongs.length - 1;
    [this.shuffledSongs[j], this.shuffledSongs[i]] = [
      this.shuffledSongs[i],
      this.shuffledSongs[j],
    ];
  }

  private addToSongs(song: Song): void {
    this.songs.push(song);
  }

  public add(song: Song | Song[]): void {
    const songsToAdd: Song[] = song instanceof Array ? song : [song];
    songsToAdd.forEach((el) => {
      this.addToSongs(el);
      this.addAndShuffle(el);
    });
  }

  protected remove(id: string): void {
    [this.songs, this.shuffledSongs].forEach((el) => {
      const index = el.findIndex((el) => el.id === id);
      if (index === -1) return;
      el.splice(index, 1);
    });
  }

  protected getCurrent(): Song {
    return this.playingSongs[0];
  }

  public getNumberOfSongs(): number {
    return this.playingSongs.length;
  }

  public shuffle(): boolean {
    this.playingSongs = this.isShuffled ? this.songs : this.shuffledSongs;
    return (this.isShuffled = !this.isShuffled);
  }

  protected loop(): void {
    this.isLoop = !this.isLoop;
  }

  protected clearQueues(): void {
    this.songs = [];
    this.shuffledSongs = [];
    this.playingSongs = this.songs;
  }
}
