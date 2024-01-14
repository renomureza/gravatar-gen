import { sha256 } from "../hash.js";
import { PROFILE_BASE_URL, ProfileFormat } from "./constant.js";

const formatOptsToSearhQuery: { [K in ProfileFormat]: string } = {
  JSON: "json",
  XML: "xml",
  VCF: "vcf",
  QR_CODE: "qr",
};

function profile(
  /**
   * The email you want to retrieve profile from Gravatar.
   */
  email: string,
  /**
   * expected profile format
   */
  format: "QR_CODE",
  /**
   * used to specify the edge length of the desired QR code image
   */
  size?: number
): Promise<string>;

function profile(
  email: string,
  format: "JSON",
  /**
   * Gravatar supports [JSONP](https://en.wikipedia.org/wiki/JSONP), callback will be wrapped around
   * the resulting JSON object and thus executed when the data is fully loaded
   */
  callback?: string
): Promise<string>;

function profile(email: string, format?: ProfileFormat): Promise<string>;

async function profile(
  email: string,
  format?: ProfileFormat,
  opts?: string | number
) {
  const hash = await sha256(email);
  const url = new URL(`${PROFILE_BASE_URL}/${hash}`);

  if (format) {
    url.pathname = url.pathname.concat(`.${formatOptsToSearhQuery[format]}`);
  }

  if (format === "JSON" && typeof opts === "string") {
    url.searchParams.set("callback", opts);
  } else if (format === "QR_CODE" && typeof opts === "number") {
    url.searchParams.set("s", String(opts));
  }

  return url.toString();
}

export { profile };
