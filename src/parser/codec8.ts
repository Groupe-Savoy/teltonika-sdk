import { TeltonikaDataCodec, type TeltonikaCodec } from "@/codec";
import { TeltonikaBaseParser } from "./base";
import { TeltonikaCodec8AVLPacket } from "@/packet/codec8";

export class TeltonikaCodec8Parser extends TeltonikaBaseParser<TeltonikaCodec8AVLPacket> {
  static codec: TeltonikaCodec = TeltonikaDataCodec.Codec8;

  parsePacket(data: Buffer): TeltonikaCodec8AVLPacket {
    return new TeltonikaCodec8AVLPacket(data);
  }
}