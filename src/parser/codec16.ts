import { type TeltonikaCodec, TeltonikaDataCodec } from "@/codec";
import { TeltonikaBaseParser } from "./base";
import { TeltonikaCodec16AVLPacket } from "@/packet/codec16";

export class TeltonikaCodec16Parser extends TeltonikaBaseParser<TeltonikaCodec16AVLPacket> {
  static codec: TeltonikaCodec = TeltonikaDataCodec.Codec16;

  parsePacket(data: Buffer): TeltonikaCodec16AVLPacket {
    return new TeltonikaCodec16AVLPacket(data);
  }
}