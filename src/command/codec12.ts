import { TeltonikaGPRSCodec } from "@/codec";
import { TeltonikaBaseCommand } from "./base";

export class TeltonikaCodec12Command extends TeltonikaBaseCommand {
  constructor(cmd: string) {
    super({
      codecId: Buffer.from([TeltonikaGPRSCodec.Codec12]),
      type: Buffer.from([0x05]), 
      numberOfCmd: Buffer.from([0x01]),
      cmd,
    })
  }

  getContent() {
    return Buffer.concat([
      this.codecId, 
      this.numberOfCmd, 
      this.type, 
      this.cmdSize, 
      this.cmd, 
      this.numberOfCmd
    ]);
  }

  toBuffer() {
    return Buffer.concat([this.preamble, this.dataSize, this.content, this.crc]);
  }
}