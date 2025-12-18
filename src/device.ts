import type { Socket } from 'node:net';
import { v4 as uuid } from 'uuid';
import { createBuffer } from './utils';
import type { TeltonikaGPRSCodec } from './codec';
import { TeltonikaCommandFactory } from './command';

export class TeltonikaDevice<T extends Socket> {
  public uuid: string;

  public imei?: string;

  public gprs?: TeltonikaGPRSCodec;

  public socket: T;

  public buffer: Buffer = Buffer.from([]);

  get isWaitingPacket() {
    return this.buffer.length !== 0;
  }

  get isInit() {
    return this.imei !== undefined;
  }

  constructor({ socket }: { socket: T }) {
    this.uuid = uuid();
    this.socket = socket;
  }

  init(imei: string, gprs: TeltonikaGPRSCodec) {
    this.imei = imei;
    this.gprs = gprs;
    this.socket.write(createBuffer(1, Buffer.from([0x01])));
  }

  sendCommand(cmd: string, codec?:  TeltonikaGPRSCodec) {
    const command = TeltonikaCommandFactory.createCommand(codec || this.gprs!, cmd, this.imei);

    this.socket.write(command.toBuffer());
  }

  bufferPacket(data: Buffer) {
    this.buffer = Buffer.concat([this.buffer, data]);
  }

  clearBuffer() {
    this.buffer = Buffer.from([]);
  }

  close() {
    this.socket.destroy();
  }
}