import { type TeltonikaCodec, TeltonikaGPRSCodec } from "@/codec";
import { TeltonikaBaseParser } from "./base";

export interface TeltonikaCodec12AVL {}

export class TeltonikaCodec12Parser extends TeltonikaBaseParser<TeltonikaCodec12AVL> {
  static codec: TeltonikaCodec = TeltonikaGPRSCodec.Codec12;

  parseAVL(data: Buffer) {
    return {}
  }
}