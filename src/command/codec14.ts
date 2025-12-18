import { TeltonikaGPRSCodec } from "@/codec";
import { TeltonikaBaseCommand } from "./base";
import { createBuffer, imeiToBuffer } from "@/utils";

export class TeltonikaCodec14Command extends TeltonikaBaseCommand {
  constructor(cmd: string, imei: string = '') {
    super({
      codecId: Buffer.from([TeltonikaGPRSCodec.Codec14]),
      type: Buffer.from([0x05]), 
      numberOfCmd: Buffer.from([0x01]),
      cmd,
      imei: imeiToBuffer(imei),
    })
  }

  getContent() {
    return Buffer.concat([
      this.codecId, 
      this.numberOfCmd, 
      this.type, 
      createBuffer(4, Buffer.from([this.cmd.length + this.imei!.length])), 
      this.imei!,
      this.cmd, 
      this.numberOfCmd
    ]);
  }

  toBuffer() {
    return Buffer.concat([this.preamble, this.dataSize, this.content, this.crc]);
  }
}