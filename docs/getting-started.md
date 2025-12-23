---
title: Getting Started
group: Guides
category: Guides
---

# Getting Started

This guide helps you get started with the **Teltonika SDK**, a TypeScript library designed to interact with Teltonika telematics devices (such as GPS trackers).

The SDK provides tools to:
- Create TCP servers compatible with Teltonika devices
- Parse incoming data packets (Codec 8, 8E, etc.)
- Send and manage GPRS commands
- Work with device connections and events in a clean, typed API


## Prerequisites

Before you begin, ensure you have the following:

- **Node.js** (v20 or later recommended)
- A package manager such as **npm**, **pnpm**, or **yarn**
- Basic knowledge of **TypeScript** or **JavaScript**
- A Teltonika device (or sample data) for testing


## Installation

Install the SDK from npm:

```bash
npm install @groupe-savoy/teltonika-sdk
````

Or using **pnpm**:

```bash
pnpm add @groupe-savoy/teltonika-sdk
```

## Basic Usage

Import the components you need from the SDK:

```ts
import {
  TeltonikaCodec8eParser,
  TeltonikaTCPServer,
} from '@groupe-savoy/teltonika-sdk';
```

From here, you can either:

* Parse Teltonika data packets manually
* Create a TCP server to receive data directly from devices
* Send GPRS commands to connected devices

## Next Steps

To learn more about each feature, refer to the dedicated guides below:

* [Parse Teltonika codec](./Parse_the_Teltonika_codec)
* [Create a Teltonika server](./Create_a_basic_server)
* [Sending a command](./Sending_a_GPRS_command)

## Need Help?

If you encounter issues or want to contribute:

* Check the project repository on GitHub
* Review the available examples
* Open an issue or submit a pull request

You're now ready to start building with Teltonika devices 
