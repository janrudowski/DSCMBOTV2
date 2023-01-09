import { customAlphabet } from "nanoid";

const alphabet: string =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

const generateNanoID = customAlphabet(alphabet, 8);

const getId = (): string => generateNanoID();

export default getId;
