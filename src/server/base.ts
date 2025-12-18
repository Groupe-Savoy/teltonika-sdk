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
  error: [device: TeltonikaDevice<U>, error?: Error]
}> {
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

  protected onDeviceInit(device: TeltonikaDevice<U>, data: Buffer<ArrayBuffer>) {
    logger.info(`init: ${device.uuid}`);
    device.init(this.parsers.data.parseImei(data), this.codecs.gprs);

    this.emit('init', device);
  }

  protected onDeviceBuffer(device: TeltonikaDevice<U>, data: Buffer<ArrayBuffer>) {
    logger.info(`buffer: ${device.uuid}`);
    device.bufferPacket(data);
    this.emit('buffer', device, data);

    if (!this.parsers.data.isCompletPacket(device.buffer)) {
      return;  
    }

    this.onDeviceData(device, device.buffer);
    device.clearBuffer();
  }

  protected onDeviceData(device: TeltonikaDevice<U>, data: Buffer<ArrayBuffer>) {
    try {
      const packet = this.parsers.data.parsePacket(data);

      device.socket.write(packet.response);
      logger.info(`data: ${device.uuid}`);
      this.emit('data', device, packet as PacketDataRegistry[DC]);
    } catch(error) {
      this.onDeviceError(device, error as Error);
    }
  }

  protected onDeviceResponse(device: TeltonikaDevice<U>, data: Buffer<ArrayBuffer>) {
    try {
      const packet = this.parsers.gprs.parsePacket(data);

      logger.info(`response: ${device.uuid}`);
      this.emit('response', device, packet as PacketResponseRegistry[GC]);
    } catch(error) {
      this.onDeviceError(device, error as Error);
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

  protected onDeviceError(device: TeltonikaDevice<U>, error?: Error) {
    logger.error(`error: ${device.uuid}`);
    this.emit('error', device, error);
  }

  public getDevice(imei: string) {
    return this.devices.find((d) => d.imei === imei);
  }

  protected addDevice(device: TeltonikaDevice<U>) {
    this.devices.push(device);
  }

  protected removeDevice(device: TeltonikaDevice<U>) {
    this.devices = this.devices.filter((d) => d.uuid !== device.uuid);
  }

  public sendCommand(imei: string, cmd: string) {
    const device = this.getDevice(imei);

    if (!device) {
      return;
    }

    device.sendCommand(cmd, this.codecs.gprs);
  }

  public closeAllDevices() {
    this.devices.forEach((device) => {
      device.close();
      this.removeDevice(device);
    });
  }

  abstract listen(port: number, host?: string): void;

  abstract close(): void;
}