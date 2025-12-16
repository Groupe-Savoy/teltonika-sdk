import { TeltonikaDataCodec, type TeltonikaCodec } from "@/codec";
import { TeltonikaBaseParser } from "./base";
import { TeltonikaCodec8eAVLPacket } from "@/packet/codec8e";

export class TeltonikaCodec8eParser extends TeltonikaBaseParser<TeltonikaCodec8eAVLPacket> {
  static codec: TeltonikaCodec = TeltonikaDataCodec.Codec8e;

  parsePacket(data: Buffer): TeltonikaCodec8eAVLPacket {
    return new TeltonikaCodec8eAVLPacket(data);
  }  
}