import { type TeltonikaCodec, TeltonikaGPRSCodec } from "@/codec";
import { TeltonikaBaseParser } from "./base";
import { TeltonikaCodec12ResponsePacket } from "@/packet/codec12";

export class TeltonikaCodec12Parser extends TeltonikaBaseParser<TeltonikaCodec12ResponsePacket> {
  static codec: TeltonikaCodec = TeltonikaGPRSCodec.Codec12;

  public isPacket(data: Buffer): boolean {
    const base = data.subarray(0, 4);
    const codec = data[8];
    const type = data[10];

    return base.equals(Buffer.from([0x00,0x00,0x00,0x00])) && type === 0x06 && codec === TeltonikaGPRSCodec.Codec12;
  }

  parsePacket(data: Buffer) {
    return new TeltonikaCodec12ResponsePacket(data);
  }
}