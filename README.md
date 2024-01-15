# Gravatar Gen

A library to generate Gravatar URLs Based on [gravatar specs](https://docs.gravatar.com/general/hash/) (uses SHA256 instead of md5), strongly typed, support image & profile URL.

## Installation

```sh
npm install gravatar-gen
```

## Image

```ts
import { image } from "gravatar-gen";

image(email, options);
```

### Parameter

- `email` - The Gravatar email
- `options`:
  - `includeExtention` - The .jpg file extension will be appended to the URL if `true`.
  - `size` - By default, images are presented at 80px by 80px if no size parameter is supplied.
  - `defaultImage` - If Email address has no matching Gravatar image, this image will be used.
    Possible values: alternative image url, `mp`, `identicon`, `monsterid`, `wavatar`, `retro`, `robohash`, `blank`.
  - `rating` - Gravatar rating: `g`, `pg`, `r`, or `x`.
  - `protocol` - `https`, `http`, or `auto`.
  - `forceDefault` - If `true` default image is always loaded.

### Return Value

Returns a Promise string URL of the gravatar image.

### Example

```ts
import { image } from "gravatar-gen";

await image("myemailaddress@example.com");
// https://gravatar.com/avatar/84059b07d4be67b806386c0aad8070a23f18836bbaae342275dc0a83414c32ee

await image("myemailaddress@example.com", {
  protocol: "http",
  defaultImage: "https://placehold.co/600x400.png",
  forceDefault: true,
  includeExtention: true,
  rating: "r",
  size: 100,
});
// http://gravatar.com/avatar/84059b07d4be67b806386c0aad8070a23f18836bbaae342275dc0a83414c32ee.jpg?s=100&d=https%3A%2F%2Fplacehold.co%2F600x400.png&f=y&r=r
```

## Profile

```ts
import { profile } from "gravatar-gen";

profile(email, format, options);
```

### Parameter

- `email` - The Gravatar email
- `format` - `JSON`, `XML`, `VCF`, `QR_CODE`.
- `options`: If format is `JSON`, options is callback. If `QR_CODE`, options is size of QR CODE image. Apart from that there is nothing.

### Return Value

Returns a Promise string URL of the gravatar profile.

### Example

```ts
import { image } from "gravatar-gen";

await profile("myemailaddress@example.com");
// https://gravatar.com/84059b07d4be67b806386c0aad8070a23f18836bbaae342275dc0a83414c32ee

await profile("myemailaddress@example.com", "JSON", "onProfileLoaded");
// https://gravatar.com/84059b07d4be67b806386c0aad8070a23f18836bbaae342275dc0a83414c32ee.json?callback=onProfileLoaded

await profile("myemailaddress@example.com", "QR_CODE", 100);
// https://gravatar.com/84059b07d4be67b806386c0aad8070a23f18836bbaae342275dc0a83414c32ee.qr?s=100

await profile("myemailaddress@example.com", "XML");
// https://gravatar.com/84059b07d4be67b806386c0aad8070a23f18836bbaae342275dc0a83414c32ee.xml
```

## Additional resources

- Gravatar Developer Resources - https://docs.gravatar.com/general/hash/
