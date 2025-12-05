import { TeltonikaDataCodec, type TeltonikaCodec } from "@/codec";
import { TeltonikaBaseParser } from "./base";

export interface TeltonikaCodec8AVL {}

export class TeltonikaCodec8Parser extends TeltonikaBaseParser<TeltonikaCodec8AVL> {
  static codec: TeltonikaCodec = TeltonikaDataCodec.Codec8;

  parseAVL(data: Buffer) {
    return {}
  }
}