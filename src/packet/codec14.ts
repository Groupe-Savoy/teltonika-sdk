import { HEADER_RESPONSE_LENGTH, TeltonikaBasePacket } from './base';
import type { TeltonikaCodec12ResponseRecord } from './codec12';

export const CODEC14_RESPONSE_TYPE_LENGTH = 1;
export const CODEC14_RESPONSE_SIZE_LENGTH = 4;
export const CODEC14_RESPONSE_IMEI_LENGTH = 8;
export const CODEC14_HEADER_LENGTH = HEADER_RESPONSE_LENGTH + CODEC14_RESPONSE_TYPE_LENGTH + CODEC14_RESPONSE_SIZE_LENGTH;
export const CODEC14_HEADER_IMEI_LENGTH = CODEC14_HEADER_LENGTH + CODEC14_RESPONSE_IMEI_LENGTH;

/**
 * Represents a response record for Teltonika Codec 14.
 * Extends TeltonikaCodec12ResponseRecord with an IMEI field.
 * 
 * @group Packet
 * @typedef {TeltonikaCodec12ResponseRecord & {imei: string}} TeltonikaCodec14ResponseRecord
 * @property {string} imei - The IMEI string of the device.
 */
export type TeltonikaCodec14ResponseRecord = TeltonikaCodec12ResponseRecord & {
  imei: string;
}

/**
 * Class for parsing Teltonika Codec 14 response packets.
 * Extends TeltonikaBasePacket to handle Codec 14 specific response parsing, including IMEI.
 * 
 * @class TeltonikaCodec14ResponsePacket
 * @group Packet
 * @extends TeltonikaBasePacket<TeltonikaCodec14ResponseRecord>
 * @example
 * ```ts
 * const packet = new TeltonikaCodec14ResponsePacket(rawBuffer);
 * const records = packet.records; // Array of TeltonikaCodec14ResponseRecord
 * ```
 */
export class TeltonikaCodec14ResponsePacket extends TeltonikaBasePacket<TeltonikaCodec14ResponseRecord> {
  /**
   * Parses the raw buffer into an array of TeltonikaCodec14ResponseRecord objects.
   * 
   * @param {Buffer} raw - The raw buffer containing the packet data.
   * @returns {TeltonikaCodec14ResponseRecord[]} An array of parsed response records.
   */
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
