import { HEADER_RESPONSE_LENGTH, TeltonikaBasePacket } from './base';

export const CODEC12_RESPONSE_TYPE_LENGTH = 1;
export const CODEC12_RESPONSE_SIZE_LENGTH = 4;
export const CODEC12_HEADER_LENGTH = HEADER_RESPONSE_LENGTH + CODEC12_RESPONSE_TYPE_LENGTH + CODEC12_RESPONSE_SIZE_LENGTH;

/**
 * @group Packet
 */
export type TeltonikaCodec12ResponseRecord = {
  type: number,
  size: number,
  response: string,
}

export class TeltonikaCodec12ResponsePacket extends TeltonikaBasePacket<TeltonikaCodec12ResponseRecord> {
  parseRecords(raw: Buffer): TeltonikaCodec12ResponseRecord[] {
    const type = raw.subarray(HEADER_RESPONSE_LENGTH, HEADER_RESPONSE_LENGTH + CODEC12_RESPONSE_TYPE_LENGTH).readInt8(0);
    const size = raw.subarray(HEADER_RESPONSE_LENGTH + CODEC12_RESPONSE_TYPE_LENGTH, CODEC12_HEADER_LENGTH).readUInt32BE(0);
    const response = raw.subarray(CODEC12_HEADER_LENGTH, CODEC12_HEADER_LENGTH + size).toString();

    return [{
      type,
      size, 
      response,
    }];
  }
}
