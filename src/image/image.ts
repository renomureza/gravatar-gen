import { sha256 } from "../hash.js";
import {
  AVATAR_BASE_URL,
  DefaultImage,
  Protocol,
  Rating,
} from "./constants.js";

const urlModifierFns: {
  [K in keyof GetImageUrlOptions]: Function;
} = {
  size: (url: URL, value: number) => {
    url.searchParams.set("s", String(value));
    return url;
  },
  defaultImage: (url: URL, value: string) => {
    url.searchParams.set("d", value);
    return url;
  },
  forceDefault: (url: URL) => {
    url.searchParams.set("f", "y");
    return url;
  },
  rating: (url: URL, value: string) => {
    url.searchParams.set("r", value);
    return url;
  },
  includeExtention: (url: URL) => {
    url.pathname = url.pathname.concat(".jpg");
    return url;
  },
  protocol: (url: string, protocol: Protocol) => {
    let urlStr = url.toString();

    if (protocol === "http") {
      urlStr = urlStr.replace("https", "http");
    }

    if (protocol === "auto") {
      urlStr = urlStr.replace("https:", "");
    }

    return urlStr;
  },
};

function mapOptsToUrl(urlWithHash: URL, opts: GetImageUrlOptions) {
  if (!Object.keys(opts).length) return urlWithHash;

  const urlWithOpts = (
    Object.keys(urlModifierFns) as (keyof typeof urlModifierFns)[]
  ).reduce((acc, curr) => {
    if (curr in opts) return urlModifierFns[curr]?.(acc, opts[curr]);
    return urlWithHash;
  }, urlWithHash);

  return urlWithOpts.toString();
}

type GetImageUrlOptions = {
  /**
   * The .jpg file extension will be appended to the URL if true.
   *
   * @default false
   */
  includeExtention?: boolean;
  /**
   * By default, images are presented at 80px by 80px if no size parameter is supplied.
   *
   * @default 80
   */
  size?: number;
  /**
   * What happens when an email address has no matching Gravatar image? By default, this: https://www.gravatar.com/avatar/00000000000000000000000000000000
   *
   * - _`image url`_ - If you’d prefer to use your own default image (perhaps your logo, a funny face, whatever)
   * - `mp` - (mystery-person) a simple, cartoon-style silhouetted outline of a person (does not vary by email hash)
   * - `identicon` - a geometric pattern based on an email hash
   * - `monsterid` - a generated ‘monster’ with different colors, faces, etc
   * - `wavatar` - generated faces with differing features and backgrounds
   * - `retro` - awesome generated, 8-bit arcade-style pixelated faces
   * - `robohash` - a generated robot with different colors, faces, etc
   * - `blank` - a transparent PNG image (border added to HTML below for demonstration purposes)
   */
  defaultImage?: DefaultImage;
  /**
   * Gravatar allows users to self-rate their images so that they can indicate if an image is appropriate for a certain audience.
   * By default, only `g` rated images are displayed unless you indicate that you would like to see higher ratings.
   *
   * - `g` - suitable for display on all websites with any audience type.
   * - `pg` - may contain rude gestures, provocatively dressed individuals, the lesser swear words, or mild violence.
   * - `r` - may contain such things as harsh profanity, intense violence, nudity, or hard drug use.
   * - `x` - may contain hardcore sexual imagery or extremely disturbing violence.
   *
   * @default 'g'
   */
  rating?: Rating;
  /**
   * - `https` - The URL will start with `https`
   * - `http` - The URL will start with `http`
   * - `auto` - The "protocol-agnostic" approach of starting the URLs with `//`
   *    which will automatically use `https:` on a secure page, or `http:` on an insecure one
   *
   * @default 'https'
   *
   */
  protocol?: Protocol;
  /**
   *
   * If for some reason you wanted to force the default image to always load
   *
   * @default false
   */
  forceDefault?: boolean;
};

/**
 * Returns the Gravatar image URL.
 *
 * @param email - The email you want to retrieve images from Gravatar.
 * @param opts - Options for generating Gravatar images.
 *
 */
export async function image(email: string, opts: GetImageUrlOptions = {}) {
  const hash = await sha256(email);
  const url = new URL(`${AVATAR_BASE_URL}/${hash}`);
  const result = mapOptsToUrl(url, opts);
  return result.toString();
}
