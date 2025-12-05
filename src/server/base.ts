import { EventEmitter } from "node:events";
import type { Socket } from "node:net";
import type { TeltonikaDevice } from "@/device";
import {
  TeltonikaDataCodec,
  TeltonikaGPRSCodec,
} from "@/codec";
import { TeltonikaParserFactory } from "@/parser";
import type { DataParserRegistry, GprsParserRegistry } from "@/parser";

type ParserForCodec<C> =
  C extends keyof DataParserRegistry ? DataParserRegistry[C] :
  C extends keyof GprsParserRegistry ? GprsParserRegistry[C] :
  any;

export interface TeltonikaBaseServerOptions {
  codecs?: {
    data: TeltonikaDataCodec;
    gprs: TeltonikaGPRSCodec;
  };
}

export declare interface TeltonikaBaseServer<
  T,
  U extends Socket,
> {
  on(event: "init", listener: (device: TeltonikaDevice<U>) => void): this;
  on(event: "data", listener: (device: TeltonikaDevice<U>, data: any) => void): this;
  on(event: "close", listener: (device: TeltonikaDevice<U>) => void): this;
}

export abstract class TeltonikaBaseServer<
  T,
  U extends Socket,
> extends EventEmitter {
  protected server!: T;

  protected devices: TeltonikaDevice<U>[] = [];

  protected codecs: { data: TeltonikaDataCodec; gprs: TeltonikaGPRSCodec };

  protected parsers: {
    data: ParserForCodec<TeltonikaDataCodec>;
    gprs: ParserForCodec<TeltonikaGPRSCodec>;
  };

  constructor(options: TeltonikaBaseServerOptions = {}) {
    super();

    const codecs = options.codecs ?? {
      data: TeltonikaDataCodec.Codec8e,
      gprs: TeltonikaGPRSCodec.Codec12,
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
