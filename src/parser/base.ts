import type { TeltonikaCodec } from "@/codec";

export abstract class TeltonikaBaseParser<T> {
  static codec: TeltonikaCodec;

  public isImei(data: Buffer) {
    const base = data.subarray(0, 2)
    return base.equals(Buffer.from([0x00, 0x0F])) && data.length === 17;
  }

  public parseImei(data: Buffer) {
    return data.subarray(2).toString();
  }

  public isAVL(data: Buffer) {
    const base = data.subarray(0, 4);
    return base.equals(Buffer.from([0x00,0x00,0x00,0x00]));
  }

  abstract parseAVL(data: Buffer): T
}