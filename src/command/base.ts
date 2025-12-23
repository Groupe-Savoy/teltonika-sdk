import { inspect } from 'util';
import { calculateCrc, createBuffer } from '@/utils';

/**
 * @group Command
 */
export type TeltonikaBaseCommandConstructor = {
  preamble?: Buffer;
  type: Buffer;
  codecId: Buffer;
  numberOfCmd: Buffer;
  cmd: string;
  imei?: Buffer;
}

/**
 * @abstract
 * @class TeltonikaBaseCommand
 * @group Command
 */
export abstract class TeltonikaBaseCommand {
  protected preamble!: Buffer;
  protected codecId!: Buffer;
  protected type!: Buffer;
  protected numberOfCmd!: Buffer;
  protected cmdSize!: Buffer;
  protected content!: Buffer;
  protected cmd!: Buffer;
  protected imei?: Buffer;

  get dataSize() {
    return createBuffer(4, Buffer.from([this.content.length]));
  }

  get crc() {
    return createBuffer(4, Buffer.from(calculateCrc(this.content).toString(16), 'hex'));
  }

  constructor(data: TeltonikaBaseCommandConstructor) {
    this.preamble = data.preamble || Buffer.from([0x00, 0x00, 0x00, 0x00]);
    this.codecId = data.codecId;
    this.numberOfCmd = data.numberOfCmd;
    this.type = data.type;
    this.cmd = Buffer.from(data.cmd);
    this.imei = data.imei;

    this.cmdSize = createBuffer(4, Buffer.from([this.cmd.length]));
    this.content = this.getContent();
  }

  [inspect.custom]() {
    return this.toBuffer();
  }

  public toString() {
    return this.toBuffer().toString('hex').toUpperCase();
  }

  abstract getContent(): Buffer;
  abstract toBuffer(): Buffer;
}