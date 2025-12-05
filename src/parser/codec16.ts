import { type TeltonikaCodec, TeltonikaDataCodec } from "@/codec";
import { TeltonikaBaseParser } from "./base";

export interface TeltonikaCodec16AVL {}

export class TeltonikaCodec16Parser extends TeltonikaBaseParser<TeltonikaCodec16AVL> {
  static codec: TeltonikaCodec = TeltonikaDataCodec.Codec16;

  parseAVL(data: Buffer) {
    return {}
  }
}