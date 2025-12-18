import { type TeltonikaCodec, TeltonikaGPRSCodec } from "@/codec";
import { TeltonikaBaseParser } from "./base";
import { TeltonikaCodec14ResponsePacket } from "@/packet/codec14";

export class TeltonikaCodec14Parser extends TeltonikaBaseParser<TeltonikaCodec14ResponsePacket> {
  static codec: TeltonikaCodec = TeltonikaGPRSCodec.Codec14;

  public isPacket(data: Buffer): boolean {
    const base = data.subarray(0, 4);
    const codec = data[8];
    const type = data[10];

    return base.equals(Buffer.from([0x00,0x00,0x00,0x00])) && [0x06, 0x11].includes(type) && codec === TeltonikaGPRSCodec.Codec14;
  }

  parsePacket(data: Buffer) {
    return new TeltonikaCodec14ResponsePacket(data);
  }
}