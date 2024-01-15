import { LiteralUnion } from "../types.js";

export const AVATAR_BASE_URL = "https://gravatar.com/avatar";
export const PROTOCOL = ["https", "http", "auto"] as const;
export const RATING = ["g", "pg", "r", "x"] as const;
export const DEFAULT_IMAGE = [
  "404",
  "mp",
  "identicon",
  "monsterid",
  "mavatar",
  "retro",
  "robohash",
  "blank",
] as const;

export type Protocol = (typeof PROTOCOL)[number];
export type DefaultImage = LiteralUnion<(typeof DEFAULT_IMAGE)[number]>;
export type Rating = (typeof RATING)[number];
