import { type TeltonikaCodec, TeltonikaGPRSCodec } from "@/codec";
import { TeltonikaBaseParser } from "./base";

export interface TeltonikaCodec14AVL {}

export class TeltonikaCodec14Parser extends TeltonikaBaseParser<TeltonikaCodec14AVL> {
  static codec: TeltonikaCodec = TeltonikaGPRSCodec.Codec14;
  
  parseAVL(data: Buffer) {
    return {}
  }
}