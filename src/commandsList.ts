import { CommandParams, CommandRules, ParamTypes } from "./../types/types";
import CommandMiddleware from "./commandMiddleware";

import {
  playHandler,
  skipHandler,
  pauseHandler,
  loopHandler,
  shuffleHandler,
  stopHandler,
} from "./handlers";

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
  )
].flat();

//todo: seperate the player etc logic from sending messages. provide 2 methods to actions example: actions: [playSong, sendMessage]

export default commandsList;
