# Teltonika SDK for TypeScript

Teltonika SDK is a developer-friendly package for interacting with Teltonika devices. Designed with TypeScript, this SDK provides an easy and type-safe way to manage GPS tracking, IoT integrations, and telemetry data.

## Installation

Install the SDK via npm:

```bash
npm install @groupe-savoy/teltonika-sdk
```

## Usage

### Setting Up a TCP Server

Here's an example for setting up a Teltonika TCP server:

```typescript
import { TeltonikaTCPServer, TeltonikaDataCodec, TeltonikaGPRSCodec } from '@groupe-savoy/teltonika-sdk';

const server = new TeltonikaTCPServer({
  codecs: {
    data: TeltonikaDataCodec.Codec8,
    gprs: TeltonikaGPRSCodec.Codec12,
  },
  timeout: 30000, // Optional timeout in milliseconds
});

// Listen for events
server.on('data', (device, data) => {
  console.log(`Received data from device ${device.imei}:`, data);
});

server.on('timeout', (device) => {
  console.log(`Device ${device.imei} timed out.`);
});

server.on('error', (device, error) => {
  console.error(`Error from device ${device.imei}:`, error);
});

// Start the server
server.listen(5000, '0.0.0.0');
```

### Parsing Data Packets with Codec8e Parser

To parse Teltonika data packets directly using the `TeltonikaCodec8eParser`:

```typescript
import { TeltonikaCodec8eParser } from 'teltonika-sdk';

const parser = new TeltonikaCodec8eParser();

// Example buffer received from a Teltonika device
const raw = Buffer.from(/* Received data */);
const packet = parser.parsePacket(raw);
```

## Development

Clone the repository:

```bash
$ git clone https://github.com/Groupe-Savoy/teltonika-sdk.git
$ cd teltonika-sdk
```

Install dependencies:

```bash
$ pnpm install
```

Run the tests:

```bash
$ pnpm run test
```

Build the library:

```bash
$ pnpm run build
```

## License

This package is released under the [MIT License](LICENSE).  


## Support

For questions, issues, or feedback, please visit the GitHub [issues page](https://github.com/Groupe-Savoy/teltonika-sdk/issues).
