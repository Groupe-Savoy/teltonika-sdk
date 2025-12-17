import { logger } from "@/logger";
import { EventEmitter } from "node:events";
import type { Socket } from "node:net";
import { TeltonikaDevice } from "@/device";
import {
  TeltonikaDataCodec,
  TeltonikaGPRSCodec,
} from "@/codec";
import { TeltonikaParserFactory } from "@/parser";
import type { DataParserRegistry, GprsParserRegistry } from "@/parser";
import type { PacketRegistry } from "@/packet";

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

export declare interface TeltonikaBaseServer<
  T,
  U extends Socket,
  DC extends TeltonikaDataCodec = TeltonikaDataCodec,
  GC extends TeltonikaGPRSCodec = TeltonikaGPRSCodec
> {
  on(event: "init", listener: (device: TeltonikaDevice<U>) => void): this;
  on(event: "data", listener: (device: TeltonikaDevice<U>, data: PacketRegistry[DC]) => void): this;
  on(event: "timeout", listener: (device: TeltonikaDevice<U>) => void): this;
  on(event: "close", listener: (device: TeltonikaDevice<U>) => void): this;
  on(event: "error", listener: (device: TeltonikaDevice<U>) => void): this;
}

export abstract class TeltonikaBaseServer<
  T,
  U extends Socket,
  DC extends TeltonikaDataCodec = TeltonikaDataCodec,
  GC extends TeltonikaGPRSCodec = TeltonikaGPRSCodec
> extends EventEmitter {
  protected server!: T;

  protected timeout?: number;

  protected devices: TeltonikaDevice<U>[] = [];

  protected codecs: { data: DC; gprs: GC };

  public parsers: {
    data: DataParserRegistry[DC];
    gprs: GprsParserRegistry[GC];
  };

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

  protected onDeviceConnect(socket: U) {
    const device = new TeltonikaDevice<U>({ socket });

    logger.info(`connect: ${device.uuid}`);
    this.addDevice(device);

    if (this.timeout) {
      socket.setTimeout(this.timeout);
    }

    socket.on('data', (data) => {
      if (this.parsers.data.isImei(data)) {
        this.onDeviceInit(device, data);
      }

      if (this.parsers.data.isPacket(data)) {
        this.onDeviceData(device, data);
      }
    });

    socket.on('error', () => this.onDeviceError(device));
    socket.on('timeout', () => this.onDeviceTimeout(device));
    socket.on('close', () => this.onDeviceClose(device));
  }

  protected onDeviceInit(device: TeltonikaDevice<U>, data: Buffer<ArrayBuffer>) {
    logger.info(`init: ${device.uuid}`);
    device.init(data.toString());

    this.emit('init', device);
  }

  protected onDeviceData(device: TeltonikaDevice<U>, data: Buffer<ArrayBuffer>) {
    try {
      const packet = this.parsers.data.parsePacket(data);

      device.socket.write(packet.response);
      logger.info(`data: ${device.uuid}`);
      this.emit('data', device, packet);
    } catch(e) {
      this.onDeviceError(device);
    }
  }

  protected onDeviceClose(device: TeltonikaDevice<U>) {
    logger.info(`close: ${device.uuid}`);
    this.emit('close', device);

    this.removeDevice(device);
  }

  protected onDeviceTimeout(device: TeltonikaDevice<U>) {
    logger.info(`timeout: ${device.uuid}`);
    this.emit('timeout', device);

    device.socket.destroy();
  }

  protected onDeviceError(device: TeltonikaDevice<U>) {
    logger.error(`error: ${device.uuid}`);
    this.emit('error', device);
  }

  protected addDevice(device: TeltonikaDevice<U>) {
    this.devices.push(device);
  }

  protected removeDevice(device: TeltonikaDevice<U>) {
    this.devices = this.devices.filter((d) => d.uuid !== device.uuid);
  }

  abstract listen(port: number, host?: string): void;
}