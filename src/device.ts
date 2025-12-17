import type { Socket } from 'node:net';
import { v4 as uuid } from 'uuid';
import { createBuffer } from './utils';
import type { TeltonikaGPRSCodec } from './codec';
import { TeltonikaCommandFactory } from './command';

export class TeltonikaDevice<T extends Socket> {
  public uuid: string;

  public imei: string = '';

  public socket: T;

  get isInit() {
    return this.imei !== '';
  }

  constructor({ socket }: { socket: T }) {
    this.uuid = uuid();
    this.socket = socket;
  }

  init(imei: string) {
    this.imei = imei;
    this.socket.write(createBuffer(1, Buffer.from([0x01])))
  }

  sendCommand(codec:  TeltonikaGPRSCodec, cmd: string) {
    const command = TeltonikaCommandFactory.createCommand(codec, cmd);

    this.socket.write(command.toBuffer());
  }
}