---
title: Create a basic server
group: Guides
---

# Server

This guide explains how to create a **basic Teltonika server** using the Teltonika SDK.  
You will learn how to set up both a **TCP server** and a **TLS (secure) server** to receive data from Teltonika devices.


## Create a TCP Server

A TCP server is the most common way to receive data from Teltonika devices.  
Devices connect to the server, authenticate using their IMEI, and then start sending AVL data packets.

### Example

```ts
import { 
  TeltonikaTCPServer, 
  TeltonikaDataCodec, 
  TeltonikaGPRSCodec,
} from '@groupe-savoy/teltonika-sdk';

const server = new TeltonikaTCPServer({
  codecs: {
    data: TeltonikaDataCodec.Codec8e,
    gprs: TeltonikaGPRSCodec.Codec12
  },
  timeout: 30000, // Optional: connection timeout in milliseconds
});

// Triggered when a device successfully connects
server.on('init', (device) => {
  console.log(`Device connected: ${device.imei}`);
});

// Triggered when data is received from a device
server.on('data', (device, data) => {
  console.log(`Data received from ${device.imei}:`, data);
});

// Triggered on parsing or connection errors
server.on('error', (device, error) => {
  console.error(`Error from device ${device?.imei}:`, error);
});

// Start listening for incoming connections
server.listen(5000, '0.0.0.0');
```

### Notes

* Teltonika devices usually connect on **TCP port 5000**
* Make sure the port is open in your firewall
* The server automatically handles:
  * IMEI identification
  * Codec parsing
  * Acknowledgements to the device

## Create a TLS Server

A TLS server allows encrypted communication between devices and your server.
This is recommended for production environments where security is required.

### Prerequisites

* A valid TLS certificate and private key
* Devices configured to use **TLS mode**

### Example

```ts
import { 
  TeltonikaTLSServer, 
  TeltonikaDataCodec, 
  TeltonikaGPRSCodec,
} from '@groupe-savoy/teltonika-sdk';
import fs from 'fs';

const server = new TeltonikaTLSServer({
  codecs: {
    data: TeltonikaDataCodec.Codec8e,
    gprs: TeltonikaGPRSCodec.Codec12
  },
  key: fs.readFileSync('./certs/server.key'),
  cert: fs.readFileSync('./certs/server.crt'),
  timeout: 30000,
});

// Device connected
server.on('init', (device) => {
  console.log(`Secure device connected: ${device.imei}`);
});

// Data received
server.on('data', (device, data) => {
  console.log(`Secure data from ${device.imei}:`, data);
});

// Error handling
server.on('error', (device, error) => {
  console.error(`TLS error from ${device?.imei}:`, error);
});

// Start TLS server
server.listen(5443, '0.0.0.0');
```

### Notes

* Default TLS port for Teltonika devices is often **5443**
* Certificates must match the device configuration
* TLS provides:
  * Encrypted data
  * Device identity validation
  * Better protection against MITM attacks

You now have a working Teltonika server ready to receive real device data.
