import { EventEmitter } from "node:events";
import type { Socket } from "node:net";
import type { TeltonikaDevice } from "@/device";
import {
  TeltonikaDataCodec,
  TeltonikaGPRSCodec,
} from "@/codec";
import { TeltonikaParserFactory } from "@/parser";
import type { DataParserRegistry, GprsParserRegistry } from "@/parser";

export interface TeltonikaBaseServerOptions<
  DC extends TeltonikaDataCodec = TeltonikaDataCodec,
  GC extends TeltonikaGPRSCodec = TeltonikaGPRSCodec
> {
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
  on(event: "data", listener: (device: TeltonikaDevice<U>, data: any) => void): this;
  on(event: "close", listener: (device: TeltonikaDevice<U>) => void): this;
}

export abstract class TeltonikaBaseServer<
  T,
  U extends Socket,
  DC extends TeltonikaDataCodec = TeltonikaDataCodec,
  GC extends TeltonikaGPRSCodec = TeltonikaGPRSCodec
> extends EventEmitter {
  protected server!: T;

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

    this.parsers = {
      data: TeltonikaParserFactory.createParser(codecs.data),
      gprs: TeltonikaParserFactory.createParser(codecs.gprs),
    };
  }

  abstract onDeviceConnect(socket: U): void;

  abstract onDeviceInit(device: TeltonikaDevice<U>, data: Buffer): void;

  abstract onDeviceData(device: TeltonikaDevice<U>, data: Buffer): void;

  abstract onDeviceClose(device: TeltonikaDevice<U>): void;

  abstract listen(port: number, host?: string): void;

  protected addDevice(device: TeltonikaDevice<U>) {
    this.devices.push(device);
  }

  protected removeDevice(device: TeltonikaDevice<U>) {
    this.devices = this.devices.filter((d) => d.uuid !== device.uuid);
  }
}