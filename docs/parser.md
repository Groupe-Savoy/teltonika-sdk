---
title: Parse the Teltonika codec
group: Guides
category: Guides
---

# Parser

This guide explains how to **parse Teltonika data packets** using the Teltonika SDK.
Teltonika devices communicate using different codecs depending on the type of data:
- **Data codecs** (Codec 8, 8E, etc.) for AVL and GPS data
- **GPRS codecs** (Codec 12) for command responses

The SDK provides parsers that allow you to validate and decode these packets easily.

## Parse Data Codec (Codec 8E)

Data codecs are used to transmit AVL records such as GPS position, IO elements, speed, and timestamps.

### Parsing a Codec 8E Packet

```ts
import { TeltonikaCodec8eParser } from '@groupe-savoy/teltonika-sdk';

const parser = new TeltonikaCodec8eParser();

// Raw IMEI sent by the device during identification
const rawImei = Buffer.from(
  '000F333536333037303432343431303133',
  'hex'
);

// Complete data packet
const rawPacket = Buffer.from('000000000000004A8E010000016B412CEE000100000000000000000000000000000000010005000100010100010011001D00010010015E2C880002000B000000003544C87A000E000000001DD7E06A00000100002994',
  'hex'
);

// Incomplete packet example (multiple records, truncated)
const rawPacketUnComplet = Buffer.from(
  '00000000000005548e110000019b2d2d8e980003e9b4171b76fd2001cd00170c',
  'hex'
);

// IMEI handling
const isImei = parser.isImei(rawImei);
const imei = parser.parseImei(rawImei);

// Packet handling
const isPacket = parser.isPacket(rawPacket);
const packet = parser.parsePacket(rawPacket);

// Packet completeness
const isComplet = parser.isCompletPacket(rawPacket);
const isUnComplet = parser.isCompletPacket(rawPacketUnComplet);

console.log('isImei:', isImei);
console.log('imei:', imei);
console.log('isPacket:', isPacket);
console.log('packet:', packet);
console.log('records:', packet.records);
console.log('isComplet:', isComplet);
console.log('isUnComplet:', isUnComplet);
```

### Key Methods

* **`isImei(buffer)`**: Checks if the buffer contains a valid IMEI
* **`parseImei(buffer)`**: Extracts the IMEI string from the buffer
* **`isPacket(buffer)`**: Validates if the buffer is a Teltonika data packet
* **`parsePacket(buffer)`**: Parses the packet and returns decoded AVL records
* **`isCompletPacket(buffer)`**: Checks whether the packet is complete or needs more data

## Parse GPRS Codec (Codec 12)

GPRS Codec 12 is used for **command responses** sent by the device after receiving a GPRS command.

### Parsing a Codec 12 Response

```ts
import { TeltonikaCodec12Parser } from '@groupe-savoy/teltonika-sdk';

const parser = new TeltonikaCodec12Parser();

// Raw IMEI
const rawImei = Buffer.from(
  '000F333536333037303432343431303133',
  'hex'
);

// GPRS response packet
const rawPacket = Buffer.from('00000000000000900C010600000088494E493A323031392F372F323220373A3232205254433A323031392F372F323220373A3533205253543A32204552523A312053523A302042523A302043463A302046473A3020464C3A302054553A302F302055543A3020534D533A30204E4F4750533A303A3330204750533A31205341543A302052533A332052463A36352053463A31204D443A30010000C78F',
  'hex'
);

// IMEI handling
const isImei = parser.isImei(rawImei);
const imei = parser.parseImei(rawImei);

// Packet handling
const isPacket = parser.isPacket(rawPacket);
const packet = parser.parsePacket(rawPacket);

console.log('isImei:', isImei);
console.log('imei:', imei);
console.log('isPacket:', isPacket);
console.log('packet:', packet);

// Access command response
console.log('response:', packet.records.at(0)?.response);
```

### What You Get from a Codec 12 Packet

* Parsed command response text
* Command execution status
* Structured access through `packet.records`

## When to Use Manual Parsing

Manual parsing is useful when:

* You are not using the built-in TCP/TLS server
* Data comes from another source (UDP, file, queue, MQTT)
* You need low-level control over packet validation

If you are using `TeltonikaTCPServer`, packet parsing is handled automatically.
You now know how to decode both **data packets** and **command responses** from Teltonika devices.
