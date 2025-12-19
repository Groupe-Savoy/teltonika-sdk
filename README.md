# Teltonika SDK for TypeScript

The **Teltonika SDK** is a developer-friendly TypeScript package for interacting with Teltonika devices. It provides a type-safe and flexible way to manage GPS tracking, IoT integrations, and telemetry data.

The SDK can be used for several use cases:

* **Server**: A fully implemented server for communicating with Teltonika telematics devices
* **Parser**: Parsers for the different Teltonika codecs
* **Command**: Utilities to easily create GPRS commands

## Supported Codecs

The following table shows the currently implemented and tested codecs:

| Codec        | Server | Parser | Command |
| ------------ | ------ | ------ | ------- |
| **Codec 8**  | ⚠️     | ✅      | —       |
| **Codec 8e** | ✅      | ✅      | —       |
| **Codec 16** | ⚠️     | ✅      | —       |
| **Codec 12** | ✅      | ✅      | ✅       |
| **Codec 13** | ❌      | ❌      | ❌       |
| **Codec 14** | ⚠️     | ✅      | ✅       |

> ✅ Implemented and tested in real conditions  
> ⚠️ Implemented but not tested in real conditions  
> ❌ Not implemented yet  

## Installation

Install the SDK via npm:

```bash
npm install @groupe-savoy/teltonika-sdk
```

## Usage

Below is a basic example showing how to use the SDK.
For more advanced examples, see the [examples](./examples/) directory.

### Setting Up a Basic TCP Server to Collect Data

Here’s an example of how to set up a Teltonika TCP server:

```ts
import {
  TeltonikaTCPServer,
  TeltonikaDataCodec,
  TeltonikaGPRSCodec,
} from '@groupe-savoy/teltonika-sdk';

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

### Parsing Data Packets with the Codec 8e Parser

You can also parse Teltonika data packets directly using the `TeltonikaCodec8eParser`:

```ts
import { TeltonikaCodec8eParser } from '@groupe-savoy/teltonika-sdk';

const parser = new TeltonikaCodec8eParser();
const packet = parser.parsePacket(Buffer.from(/* received data */));
```

## Development

Clone the repository:

```bash
git clone https://github.com/Groupe-Savoy/teltonika-sdk.git
cd teltonika-sdk
```

Install dependencies:

```bash
pnpm install
```

Run the tests:

```bash
pnpm run test
```

Build the library:

```bash
pnpm run build
```

## License

This project is released under the [MIT License](LICENSE.md).

## Support

For questions, issues, or feedback, please visit the GitHub [Issues page](https://github.com/Groupe-Savoy/teltonika-sdk/issues).

## Contributing

Contributions are welcome!
Please read the [CONTRIBUTING](./CONTRIBUTING.md) guide for more information.
