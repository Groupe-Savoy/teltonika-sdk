import { type TeltonikaCodec, TeltonikaGPRSCodec } from "@/codec";
import { TeltonikaBaseParser } from "./base";

export interface TeltonikaCodec13AVL {}

export class TeltonikaCodec13Parser extends TeltonikaBaseParser<TeltonikaCodec13AVL> {
  static codec: TeltonikaCodec = TeltonikaGPRSCodec.Codec13;

  parseAVL(data: Buffer) {
    return {}
  }
}