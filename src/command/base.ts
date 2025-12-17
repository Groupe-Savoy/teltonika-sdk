import { calculateCrc, createBuffer } from "@/utils";

export type TeltonikaBaseCommandConstructor = {
  preamble?: Buffer;
  type: Buffer;
  codecId: Buffer;
  numberOfCmd: Buffer;
  cmd: string;
}

export abstract class TeltonikaBaseCommand {
  protected preamble!: Buffer;
  protected codecId!: Buffer;
  protected type!: Buffer;
  protected numberOfCmd!: Buffer;
  protected cmdSize!: Buffer;
  protected content!: Buffer;
  protected cmd!: Buffer;

  get dataSize() {
    return createBuffer(4, Buffer.from([this.content.length]))
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

    this.cmdSize = createBuffer(4, Buffer.from([this.cmd.length]));
    this.content = this.getContent();
  }

  abstract getContent(): Buffer;
  abstract toBuffer(): Buffer;
}