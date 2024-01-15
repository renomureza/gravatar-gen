import { profile } from "./profile";
import { describe, expect, test } from "vitest";

const hash = "84059b07d4be67b806386c0aad8070a23f18836bbaae342275dc0a83414c32ee";
const email = "myemailaddress@example.com";

test("without format, url should end with path", async () => {
  const url = await profile(email);
  expect(url.endsWith(hash)).toBe(true);
});

test("VCF format, url should end with '.vcf'", async () => {
  const url = await profile(email, "VCF");
  expect(url.endsWith(".vcf")).toBe(true);
});

test("XML format, url should end with '.xml'", async () => {
  const url = await profile(email, "XML");
  expect(url.endsWith(".xml")).toBe(true);
});

describe("JSON", () => {
  test("url should end with '.json'", async () => {
    const url = await profile(email, "JSON");
    expect(url.endsWith(".json")).toBe(true);
  });

  test("with callback should have search param 'callback'", async () => {
    const callback = "profileCallback";

    const urlStr = await profile(email, "JSON", callback);
    const url = new URL(urlStr);

    const actualCallbackValue = url.searchParams.get("callback");

    expect(url.pathname.endsWith(".json")).toBe(true);
    expect(actualCallbackValue).toEqual(callback);
  });
});

describe("QR CODE", () => {
  test("url should end with '.qr'", async () => {
    const url = await profile(email, "QR_CODE");
    expect(url.endsWith(".qr")).toBe(true);
  });

  test("with size should have search param 's'", async () => {
    const size = 100;

    const urlStr = await profile(email, "QR_CODE", size);
    const url = new URL(urlStr);

    const actualSize = Number(url.searchParams.get("s"));

    expect(url.pathname.endsWith(".qr")).toBe(true);
    expect(actualSize).toEqual(size);
  });
});
