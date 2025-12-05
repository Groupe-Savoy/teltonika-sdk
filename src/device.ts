import type { Socket } from 'node:net';
import { v4 as uuid } from 'uuid';

export class TeltonikaDevice<T extends Socket> {
  public uuid: string;

  public imei: string = '';

  public socket: T;

  get isInit() {
    return this.imei !== '';
  }

  constructor({ socket }: { socket: T }) {
    this.uuid = uuid();
    this.socket = socket
  }

  init(imei: string) {
    this.imei = imei;
    this.socket.write(this.createBuffer(1, [0x01]))
  }

  public createBuffer(size: number, data: any) {
    const buf = Buffer.alloc(size, 0x00);
    const value = Buffer.from(data);

    value.copy(buf, size - value.length);

    return buf;
  }
}