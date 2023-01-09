import { Config } from "./../types/types";
import * as dotenv from "dotenv";
dotenv.config({ path: "./process.env" });

export const config: Config = {
  DISCORD_TOKEN: process.env.DISCORD_TOKEN!,
  COMMAND_PREFIX: "?",
};
