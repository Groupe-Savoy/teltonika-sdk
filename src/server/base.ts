import { logger } from '@/logger';
import { EventEmitter } from 'node:events';
import type { Socket } from 'node:net';
import { TeltonikaDevice } from '@/device';
import {
  TeltonikaDataCodec,
  TeltonikaGPRSCodec,
} from '@/codec';
import { TeltonikaParserFactory } from '@/parser';
import type { DataParserRegistry, GprsParserRegistry } from '@/parser';
import type { PacketDataRegistry, PacketResponseRegistry } from '@/packet';

/**
 * @group Server
 * @template DC - Data codec type (TeltonikaDataCodec)
 * @template GC - GPRS codec type (TeltonikaGPRSCodec)
 * @typedef {Object} TeltonikaBaseServerOptions
 * @property {number} [timeout] - Optional socket timeout in milliseconds.
 * @property {{ data: DC; gprs: GC }} [codecs] - Optional codec overrides for data and GPRS packets.
 */
export interface TeltonikaBaseServerOptions<
  DC extends TeltonikaDataCodec = TeltonikaDataCodec,
  GC extends TeltonikaGPRSCodec = TeltonikaGPRSCodec
> {
  timeout?: number,
  codecs?: {
    data: DC;
    gprs: GC;
  };
}

/**
 * Base abstract server class for managing Teltonika device connections.
 * Handles device lifecycle, parsing incoming data, buffering incomplete packets,
 * sending responses, and emitting events for server users.
 * 
 * @abstract
 * @class TeltonikaBaseServer
 * @group Server
 * @template T - Type of server instance (e.g., TCP server)
 * @template U - Type of socket (extends TCP Socket)
 * @template DC - Data codec
 * @template GC - GPRS codec
 * @document ../../docs/server.md
 */
export abstract class TeltonikaBaseServer<
  T,
  U extends Socket,
  DC extends TeltonikaDataCodec = TeltonikaDataCodec,
  GC extends TeltonikaGPRSCodec = TeltonikaGPRSCodec
> extends EventEmitter<{
  init: [device: TeltonikaDevice<U>],
  data: [device: TeltonikaDevice<U>, data: PacketDataRegistry[DC]],
  buffer: [device: TeltonikaDevice<U>, data: Buffer],
  response: [device: TeltonikaDevice<U>, data: PacketResponseRegistry[GC]],
  timeout: [device: TeltonikaDevice<U>],
  close: [device: TeltonikaDevice<U>],
  error: [device?: TeltonikaDevice<U>, error?: Error]
}> {
  /** The underlying server instance (TCP, UDP, etc.) */
  protected server!: T;

  /** Socket timeout in milliseconds */
  protected timeout?: number;

  /** List of connected devices */
  protected devices: TeltonikaDevice<U>[] = [];

  /** Configured codecs for data and GPRS packets */
  protected codecs: { data: DC; gprs: GC };

  /** Parsers for incoming data and GPRS packets */
  public parsers: {
    data: DataParserRegistry[DC];
    gprs: GprsParserRegistry[GC];
  };

  /**
   * Initializes the server with optional timeout and codec configuration.
   * @param {TeltonikaBaseServerOptions<DC, GC>} [options]
   */
  constructor(options: TeltonikaBaseServerOptions<DC, GC> = {}) {
    super();

    const codecs = options.codecs ?? {
      data: TeltonikaDataCodec.Codec8e as DC,
      gprs: TeltonikaGPRSCodec.Codec12 as GC,
    };

    this.codecs = codecs;
    this.timeout = options.timeout;

    this.parsers = {
      data: TeltonikaParserFactory.createParser(codecs.data),
      gprs: TeltonikaParserFactory.createParser(codecs.gprs),
    };
  }

  /**
   * Handles a newly connected device socket.
   * Sets up event listeners for data, timeout, error, and close events.
   * @param {U} socket
   * @protected
   */
  protected onDeviceConnect(socket: U) {
    const device = new TeltonikaDevice<U>({ socket });

    logger.info(`connect: ${device.uuid}`);
    this.addDevice(device);

    if (this.timeout) {
      socket.setTimeout(this.timeout);
    }

    socket.on('data', (data) => {
      const isImei = this.parsers.data.isImei(data);
      const isData = this.parsers.data.isPacket(data);
      const isComplet = this.parsers.data.isCompletPacket(data);
      const isResponse = this.parsers.gprs.isPacket(data);

      if (isImei) {
        this.onDeviceInit(device, data);
      }

      if ((isData && !isResponse && !isComplet) || device.isWaitingPacket) {
        this.onDeviceBuffer(device, data);
        return;
      }

      if (isData && !isResponse) {
        this.onDeviceData(device, data);
      }

      if (isResponse) {
        this.onDeviceResponse(device, data);
      }
    });

    socket.on('error', () => this.onDeviceError(device));
    socket.on('timeout', () => this.onDeviceTimeout(device));
    socket.on('close', () => this.onDeviceClose(device));
  }

  /**
   * Initializes the device when an IMEI packet is received.
   * @param {TeltonikaDevice<U>} device
   * @param {Buffer} data
   * @protected
   */
  protected onDeviceInit(device: TeltonikaDevice<U>, data: Buffer) {
    logger.info(`init: ${device.uuid}`);
    device.init(this.parsers.data.parseImei(data), this.codecs.gprs);

    this.emit('init', device);
  }

  /**
   * Buffers incoming data from a device until a complete packet is received.
   * @param {TeltonikaDevice<U>} device
   * @param {Buffer} data
   * @protected
   */
  protected onDeviceBuffer(device: TeltonikaDevice<U>, data: Buffer) {
    logger.info(`buffer: ${device.uuid}`);
    device.bufferPacket(data);
    this.emit('buffer', device, data);

    if (!this.parsers.data.isCompletPacket(device.buffer)) {
      return;  
    }

    this.onDeviceData(device, device.buffer);
    device.clearBuffer();
  }

  /**
   * Parses a complete data packet and emits a `data` event.
   * @param {TeltonikaDevice<U>} device
   * @param {Buffer} data
   * @protected
   */
  protected onDeviceData(device: TeltonikaDevice<U>, data: Buffer) {
    try {
      const packet = this.parsers.data.parsePacket(data);

      device.socket.write(packet.response);
      logger.info(`data: ${device.uuid}`);
      this.emit('data', device, packet as PacketDataRegistry[DC]);
    } catch(error) {
      this.onDeviceError(device, error as Error);
    }
  }

  /**
   * Parses a GPRS response packet and emits a `response` event.
   * @param {TeltonikaDevice<U>} device
   * @param {Buffer} data
   * @protected
   */
  protected onDeviceResponse(device: TeltonikaDevice<U>, data: Buffer) {
    try {
      const packet = this.parsers.gprs.parsePacket(data);

      logger.info(`response: ${device.uuid}`);
      this.emit('response', device, packet as PacketResponseRegistry[GC]);
    } catch(error) {
      this.onDeviceError(device, error as Error);
    }
  }

  /**
   * Handles device socket closure and removes the device from the list.
   * @param {TeltonikaDevice<U>} device
   * @protected
   */
  protected onDeviceClose(device: TeltonikaDevice<U>) {
    logger.info(`close: ${device.uuid}`);
    this.emit('close', device);

    this.removeDevice(device);
  }

  /**
   * Handles device socket timeout and destroys the socket.
   * @param {TeltonikaDevice<U>} device
   * @protected
   */
  protected onDeviceTimeout(device: TeltonikaDevice<U>) {
    logger.info(`timeout: ${device.uuid}`);
    this.emit('timeout', device);

    device.socket.destroy();
  }

  /**
   * Handles errors and emits an `error` event.
   * @param {TeltonikaDevice<U>} [device]
   * @param {Error} [error]
   * @protected
   */
  protected onDeviceError(device?: TeltonikaDevice<U>, error?: Error) {
    logger.error(`error: ${device?.uuid || 'not initialized'}`);
    this.emit('error', device, error);
  }

  /**
   * Finds a connected device by its IMEI.
   * @param {string} imei
   * @returns {TeltonikaDevice<U> | undefined}
   */
  public getDevice(imei: string) {
    return this.devices.find((d) => d.imei === imei);
  }

  /**
   * Adds a device to the connected devices list.
   * @param {TeltonikaDevice<U>} device
   * @protected
   */
  protected addDevice(device: TeltonikaDevice<U>) {
    this.devices.push(device);
  }

  /**
   * Removes a device from the connected devices list.
   * @param {TeltonikaDevice<U>} device
   * @protected
   */
  protected removeDevice(device: TeltonikaDevice<U>) {
    this.devices = this.devices.filter((d) => d.uuid !== device.uuid);
  }

  /**
   * Sends a command to a device by IMEI.
   * @param {string} imei
   * @param {string} cmd
   */
  public sendCommand(imei: string, cmd: string) {
    const device = this.getDevice(imei);

    if (!device) {
      return;
    }

    device.sendCommand(cmd, this.codecs.gprs);
  }

  /**
   * Closes all connected devices and removes them from the list.
   */
  public closeAllDevices() {
    this.devices.forEach((device) => {
      device.close();
      this.removeDevice(device);
    });
  }

  /**
   * Starts the server and begins listening for connections.
   * Must be implemented in subclasses.
   * @param {number} port
   * @param {string} [host]
   * @abstract
   * @returns {Promise<void>}
   */
  abstract listen(port: number, host?: string): Promise<void>;

  /**
   * Closes the server and all device connections.
   * Must be implemented in subclasses.
   * @abstract
   * @returns {Promise<void>}
   */
  abstract close(): Promise<void>;
}