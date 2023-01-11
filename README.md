
## Installation

### How to install and use the bot

1. Create an application in Discord Developer Portal
2. Create a bot
3. Clone the repo
   ```sh
   git clone https://github.com/janrudowski/DSCMBOTV2.git
   ```
4. Install NPM packages
   ```sh
   npm install
   ```
5. Copy the bot token and paste it in the process.env file
   ```js
   DISCORD_TOKEN = TOKEN_HERE
   ```
6. To run the app
   ```sh
   npm run dev
7. To build
   ```sh
   npm run build

## Usage



### How to use

The default command prefix is "!". In order to change it navigate to ```config``` directory and edit the ```config.ts``` file.

```ts
export const config: Config = {
  COMMAND_PREFIX: "YOUR PREFIX HERE",
};
```

### Basic commands
```sh
#play (play song/add song to queue)
!play query|yt_url|yt_playlist_url
#e.g.
!play "viva la vida"

#skip (skips the current song)
!skip

#pause (pause the current song)
!pause

#loop (loop the current song)
!loop

#shuffle (shuffle queue)
!shuffle

#stop (stops the player and clears the queue)
!stop
```

## Documentation

### Additional commands

You can add new commands simply by expanding the ```commandsList``` array in the  ```commandsList.ts``` file.

_Default file_

```ts
const commandsList: CommandParams[] = [
  CommandMiddleware.group(
    [
      CommandRules.voice_same_as_player_required,
      CommandRules.voice_required,
      CommandRules.player_required,
    ],
    [
      { name: "skip", actions: skipHandler },
      { name: "pause", actions: pauseHandler },
      { name: "loop", actions: loopHandler },
      { name: "shuffle", actions: shuffleHandler },
      { name: "stop", actions: stopHandler },
    ]
  ),
  CommandMiddleware.group(
    [CommandRules.voice_required],
    [
      {
        name: "play",
        expectedParams: [
          [
            ParamTypes.youtube_playlist,
            ParamTypes.youtube_song,
            ParamTypes.string,
          ],
        ],
        actions: playHandler,
      },
    ]
  ),
].flat();
```
