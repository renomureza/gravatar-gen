import { describe, expect, test } from "vitest";
import { image } from "./image";
import { AVATAR_BASE_URL } from "./constants";

const hash = "84059b07d4be67b806386c0aad8070a23f18836bbaae342275dc0a83414c32ee";
const email = "myemailaddress@example.com";
const defaultImage = "https://placehold.co/600x400.png";

test(`URL must be start with ${AVATAR_BASE_URL}`, async () => {
  const url = await image(email);
  expect(url.toString().startsWith(AVATAR_BASE_URL)).toBe(true);
});

test("email hash must be added to the pathname", async () => {
  const url = await image(email);
  const actualHash = new URL(url).pathname.split("/")?.[2];
  expect(actualHash).toEqual(hash);
});

test("wihtout options should not have search params", async () => {
  const url = await image(email);
  expect(new URL(url).searchParams.size).toEqual(0);
});

describe("Protocol", () => {
  test("Default protocol should be 'https'", async () => {
    const url = await image(email);
    expect(url.startsWith("https")).toBe(true);
  });

  test("with 'http' option should start with 'http'", async () => {
    const url = await image(email, { protocol: "http" });
    expect(url.startsWith("http")).toBe(true);
  });

  test("with 'https' option should start with 'https'", async () => {
    const url = await image(email, { protocol: "https" });
    expect(url.startsWith("https")).toBe(true);
  });

  test("with 'auto' option should start with '//'", async () => {
    const url = await image(email, { protocol: "auto" });
    expect(url.startsWith("//")).toBe(true);
  });
});

describe("Default Image", () => {
  test("with default image should have query params 'd'", async () => {
    const urlStr = await image(email, { defaultImage });
    const url = new URL(urlStr);
    const actualDefaultImage = url.searchParams.get("d");

    expect(actualDefaultImage).toEqual(defaultImage);
  });
});

describe("Rating", () => {
  test("with default rating should have query params 'r'", async () => {
    const rating = "pg";

    const urlStr = await image(email, { rating });
    const url = new URL(urlStr);
    const actualRating = url.searchParams.get("r");

    expect(actualRating).toEqual(rating);
  });
});

describe("Force Default", () => {
  test("with 'force default' should have query params 'f=y'", async () => {
    const urlStr = await image(email, { forceDefault: true });
    const url = new URL(urlStr);
    const actualQuerValue = url.searchParams.get("f");

    expect(actualQuerValue).toEqual("y");
  });
});

describe("Size", () => {
  test("with 'size' should have query params 's'", async () => {
    const size = 120;

    const urlStr = await image(email, { size: size });
    const url = new URL(urlStr);

    const actualSize = Number(url.searchParams.get("s"));

    expect(actualSize).toEqual(size);
  });
});

describe("Include Extension", () => {
  test("with 'include extension' pathname should ends with '.jpg'", async () => {
    const urlStr = await image(email, { includeExtention: true });
    const url = new URL(urlStr);

    const pathnameIsEndWithJpgExt = url.pathname.endsWith(".jpg");

    expect(pathnameIsEndWithJpgExt).toBe(true);
  });
});

test("Combined Options", async () => {
  const urlStr = await image(email, {
    protocol: "http",
    defaultImage,
    forceDefault: true,
    includeExtention: true,
    rating: "r",
    size: 100,
  });
  const url = new URL(urlStr);

  expect(urlStr.startsWith("http"), "starts with http").toBe(true);
  expect(url.searchParams.get("d"), "having default image").toEqual(
    defaultImage
  );
  expect(url.searchParams.get("f"), "having force default").toEqual("y");
  expect(url.searchParams.get("s"), "having size").toEqual("100");
  expect(url.pathname.endsWith(".jpg"), "having extentions").toBe(true);
  expect(url.searchParams.get("r"), "having rating").toEqual("r");
});
