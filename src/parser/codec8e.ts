import { TeltonikaDataCodec, type TeltonikaCodec } from "@/codec";
import { TeltonikaBaseParser } from "./base";

export interface TeltonikaCodec8eAVL {
  preamble:  Buffer<ArrayBufferLike>,
  size:  Buffer<ArrayBufferLike>,
  id:  Buffer<ArrayBufferLike>,
  number:  Buffer<ArrayBufferLike>,
  timestamp:  Date,
  priority:  Buffer<ArrayBufferLike>,
  longitude:  Buffer<ArrayBufferLike>,
  altitude:  Buffer<ArrayBufferLike>,
  angle:  Buffer<ArrayBufferLike>
}

export class TeltonikaCodec8eParser extends TeltonikaBaseParser<TeltonikaCodec8eAVL> {
  static codec: TeltonikaCodec = TeltonikaDataCodec.Codec8e;

  public parseAVL(data: Buffer): TeltonikaCodec8eAVL {
    const preamble = data.subarray(0, 4);
    const size = data.subarray(4, 8);
    const id = data.subarray(8, 9);
    const number = data.subarray(9, 10);
    const timestamp = new Date(Number(data.subarray(10, 18).readBigUInt64BE(0)));
    const priority = data.subarray(18, 19);
    const longitude = data.subarray(19, 23);
    const altitude = data.subarray(23, 25);
    const angle = data.subarray(25, 27);

    return {
      preamble,
      size,
      id,
      number,
      timestamp,
      priority,
      longitude,
      altitude,
      angle
    }
  }
}