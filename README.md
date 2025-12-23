# Teltonika SDK for TypeScript

The **Teltonika SDK** is a developer-friendly TypeScript package for interacting with Teltonika telematics devices. It provides a type-safe and flexible way to handle GPS tracking, IoT integrations, and telemetry data.

The SDK supports several use cases:

* **Server**: A ready-to-use server for communicating with Teltonika devices
* **Parser**: Parsers for the different Teltonika codecs
* **Command**: Utilities for easily creating and sending GPRS commands

> For more information about Teltonika codecs, see the official documentation [here](https://wiki.teltonika-gps.com/view/Codec#).

## Installation

Install the SDK via npm:

```bash
npm install @groupe-savoy/teltonika-sdk
```

## Usage

Below is a basic example showing how to use the SDK.  
For more advanced examples, see the [examples](./examples/) directory.

### Setting Up a Basic TCP Server

The following example shows how to create a TCP server to receive data from Teltonika devices:

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

### Parsing Data Packets (Codec 8e)

You can also parse Teltonika data packets directly using the `TeltonikaCodec8eParser`:

```ts
import { TeltonikaCodec8eParser } from '@groupe-savoy/teltonika-sdk';

const parser = new TeltonikaCodec8eParser();
const packet = parser.parsePacket(Buffer.from(/* received data */));
```

## Supported Codecs and Protocols

### Codecs

The table below lists the currently implemented and tested codecs:

| Codec        | Server | Parser | Command |
| ------------ | ------ | ------ | ------- |
| **Codec 8**  | ⚠️     | ✅      | —       |
| **Codec 8e** | ✅      | ✅      | —       |
| **Codec 16** | ⚠️     | ✅      | —       |
| **Codec 12** | ✅      | ✅      | ✅       |
| **Codec 13** | ❌      | ❌      | ❌       |
| **Codec 14** | ⚠️     | ✅      | ✅       |

### Server Protocols

The following table shows the server protocols currently supported:

| TCP | TLS | UDP |
| --- | --- | --- |
| ✅   | ✅   | ❌   |

**Legend:**

* ✅ Implemented and tested in real-world conditions
* ⚠️ Implemented but not tested in real-world conditions
* ❌ Not implemented


## Learn More

The online documentation is the best place to learn how to use the SDK efficiently.

- Start here if you’re new
- Dive deeper for advanced server, codec, and command usage
- Explore the full API reference

**[Access the documentation](https://groupe-savoy.github.io/teltonika-sdk/documents/Getting_Started.html)**


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

Run tests:

```bash
pnpm test
```

Build the library:

```bash
pnpm build
```


## License

This project is released under the [MIT License](LICENSE.md).


## Support

For questions, issues, or feedback, please visit the GitHub
[Issues page](https://github.com/Groupe-Savoy/teltonika-sdk/issues).


## Contributing

Contributions are welcome!
Please read the [CONTRIBUTING](./CONTRIBUTING.md) guide for more information.
