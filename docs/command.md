---
title: Sending a GPRS command
group: Guides
category: Guides
---

# Command

This guide explains how to **send GPRS commands to a Teltonika device** using the Teltonika SDK.
GPRS commands allow you to remotely interact with a device, for example to:
- Retrieve device information
- Check firmware or configuration
- Trigger actions such as rebooting the device
- Debug or monitor device behavior

## Send a Command to a Device

To send commands, your server must:
- Be connected to the device
- Use a compatible **GPRS codec** (usually Codec 12)
- Keep the connection open while waiting for the device response

## Sending Commands on Device Connection

Below is a complete example showing how to:
- Create a TCP server
- Configure data and GPRS codecs
- Send commands to a connected device
- Receive and handle command responses

```ts
import {
  TeltonikaDataCodec,
  TeltonikaGPRSCodec,
  TeltonikaTCPServer
} from '@groupe-savoy/teltonika-sdk';

const server = new TeltonikaTCPServer({
  codecs: {
    data: TeltonikaDataCodec.Codec8e,
    gprs: TeltonikaGPRSCodec.Codec12,
  },
  timeout: 60000,
});

// Triggered when the device is initialized and ready
server.on('init', (device) => {
  // Send commands directly from the device instance
  setTimeout(() => device.sendCommand('getver'), 1000);
  setTimeout(() => device.sendCommand('getinfo'), 2000);

  // The server can also send a command using the device IMEI
  setTimeout(() => {
    server.sendCommand(device.imei!, 'cpureset');
  }, 10000);
});

// Triggered when the device sends a command response
server.on('response', (device, data) => {
  console.log('Response from device:', device.imei);
  console.log(data.records);
});

// Handle errors
server.on('error', (device, error) => {
  console.error('Error:', device?.imei, error);
});

// Start listening for device connections
server.listen(4041, '0.0.0.0');
```


## Available Ways to Send Commands

### From a Device Instance

```ts
device.sendCommand('getver');
```

Use this approach when you already have access to the connected device object.

### From the Server Using an IMEI

```ts
server.sendCommand('123456789012345', 'getinfo');
```

This is useful when:

* Commands are triggered by an external event (API call, UI action, cron job)
* You only know the device IMEI

## Handling Command Responses

Command responses are emitted through the `response` event:

```ts
server.on('response', (device, data) => {
  console.log(data.records);
});
```

* `data.records` contains the parsed response payload
* Responses depend on the command sent and the device model

## Common GPRS Commands

Some commonly used commands include:

* `getver` – Get firmware version
* `getinfo` – Get device information
* `cpureset` – Restart the device

> Available commands depend on the **device model and firmware version**.
Always refer to the official Teltonika documentation.

## Best Practices

* Add delays between commands to avoid overloading the device
* Always handle the `response` event
* Use `timeout` values appropriate for your network conditions
* Avoid sending critical commands (e.g. reboot) in tight loops

You can now control Teltonika devices remotely using GPRS commands.
