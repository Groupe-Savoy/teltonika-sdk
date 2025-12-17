import { TeltonikaBasePacket } from "./base";

export type TeltonikaCodec12ResponseRecord = {
  type: number,
  size: number,
  response: string,
}

export class TeltonikaCodec12ResponsePacket extends TeltonikaBasePacket<TeltonikaCodec12ResponseRecord> {
  parseRecords(raw: Buffer): TeltonikaCodec12ResponseRecord[] {
    return [{
      type: raw[10],
      size: raw.subarray(11, 15).readUInt32BE(0), 
      response: raw.subarray(15, raw.subarray(11, 15).readUInt32BE(0) + 15).toString(),
    }]
  }
}
