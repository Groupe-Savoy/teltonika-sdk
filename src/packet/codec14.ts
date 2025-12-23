import { HEADER_RESPONSE_LENGTH, TeltonikaBasePacket } from './base';
import type { TeltonikaCodec12ResponseRecord } from './codec12';

export const CODEC14_RESPONSE_TYPE_LENGTH = 1;
export const CODEC14_RESPONSE_SIZE_LENGTH = 4;
export const CODEC14_RESPONSE_IMEI_LENGTH = 8;
export const CODEC14_HEADER_LENGTH = HEADER_RESPONSE_LENGTH + CODEC14_RESPONSE_TYPE_LENGTH + CODEC14_RESPONSE_SIZE_LENGTH;
export const CODEC14_HEADER_IMEI_LENGTH = CODEC14_HEADER_LENGTH + CODEC14_RESPONSE_IMEI_LENGTH;

/**
 * @group Packet
 */
export type TeltonikaCodec14ResponseRecord = TeltonikaCodec12ResponseRecord & {
  imei: string;
}

export class TeltonikaCodec14ResponsePacket extends TeltonikaBasePacket<TeltonikaCodec14ResponseRecord> {
  parseRecords(raw: Buffer): TeltonikaCodec14ResponseRecord[] {
    const type = raw.subarray(HEADER_RESPONSE_LENGTH, HEADER_RESPONSE_LENGTH + CODEC14_RESPONSE_TYPE_LENGTH).readInt8(0);
    const size = raw.subarray(HEADER_RESPONSE_LENGTH + CODEC14_RESPONSE_TYPE_LENGTH, CODEC14_HEADER_LENGTH).readUInt32BE(0);
    const imei = raw.subarray(CODEC14_HEADER_LENGTH, CODEC14_HEADER_IMEI_LENGTH).toString('hex');
    const response =  raw.subarray(CODEC14_HEADER_IMEI_LENGTH, CODEC14_RESPONSE_IMEI_LENGTH + size).toString();

    return [{
      type,
      size,
      imei,
      response,
    }];
  }
}
